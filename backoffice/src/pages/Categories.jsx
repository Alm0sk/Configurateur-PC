import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => categoriesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoriesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoriesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const openModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      icon: formData.get("icon") || null,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredCategories = categories?.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Gérez les catégories de composants"
              : "Consultez les catégories de composants"}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icône</TableHead>
                  {isAdmin && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories?.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.icon || "-"}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModal(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {editingCategory
                  ? "Modifier la catégorie"
                  : "Nouvelle catégorie"}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingCategory?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={editingCategory?.description}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icône (optionnel)</Label>
                  <Input
                    id="icon"
                    name="icon"
                    defaultValue={editingCategory?.icon}
                    placeholder="ex: cpu, gpu, memory..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingCategory ? "Modifier" : "Créer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
