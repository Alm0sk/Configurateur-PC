import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { componentsAPI, categoriesAPI } from "../services/api";
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
import { Badge } from "../components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Plus, Pencil, Trash2, X, Search, Eye } from "lucide-react";

export function Components() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { data: components, isLoading } = useQuery({
    queryKey: ["components"],
    queryFn: () => componentsAPI.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => componentsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["components"]);
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => componentsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["components"]);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => componentsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["components"]);
    },
  });

  const openModal = (component = null) => {
    setEditingComponent(component);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingComponent(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Parse specifications from textarea
    const specsText = formData.get("specifications") || "";
    const specifications = {};
    if (specsText.trim()) {
      specsText.split("\n").forEach((line) => {
        const [key, ...valueParts] = line.split(":");
        if (key && valueParts.length > 0) {
          specifications[key.trim()] = valueParts.join(":").trim();
        }
      });
    }

    const data = {
      title: formData.get("title"),
      brand: formData.get("brand"),
      model: formData.get("model"),
      description: formData.get("description"),
      basePrice: parseFloat(formData.get("basePrice")),
      category: formData.get("category"),
      image: formData.get("image") || null,
      specifications,
      inStock: formData.get("inStock") === "true",
      isActive: formData.get("isActive") === "true",
    };

    if (editingComponent) {
      updateMutation.mutate({ id: editingComponent._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce composant ?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredComponents = components?.filter((comp) => {
    const matchesSearch =
      comp.title?.toLowerCase().includes(search.toLowerCase()) ||
      comp.brand?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !categoryFilter || comp.category?._id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Composants</h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Gérez les composants PC disponibles"
              : "Consultez les composants PC disponibles"}
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
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Toutes catégories</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
                  <TableHead>Marque</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComponents?.map((comp) => (
                  <TableRow key={comp._id}>
                    <TableCell className="font-medium">{comp.title}</TableCell>
                    <TableCell>{comp.brand}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{comp.category?.name}</Badge>
                    </TableCell>
                    <TableCell>{comp.basePrice?.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Badge variant={comp.isActive ? "success" : "secondary"}>
                        {comp.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/components/${comp._id}`)}
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openModal(comp)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(comp._id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
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
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {editingComponent
                  ? "Modifier le composant"
                  : "Nouveau composant"}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Nom</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingComponent?.title}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marque</Label>
                    <Input
                      id="brand"
                      name="brand"
                      defaultValue={editingComponent?.brand}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modèle</Label>
                    <Input
                      id="model"
                      name="model"
                      defaultValue={editingComponent?.model}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={editingComponent?.description}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://..."
                    defaultValue={editingComponent?.image}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specifications">
                    Spécifications techniques
                    <span className="text-xs text-muted-foreground ml-2">
                      (une par ligne, format: Clé: Valeur)
                    </span>
                  </Label>
                  <textarea
                    id="specifications"
                    name="specifications"
                    defaultValue={
                      editingComponent?.specifications
                        ? Object.entries(editingComponent.specifications)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join("\n")
                        : ""
                    }
                    placeholder="Fréquence: 3.5 GHz&#10;Cœurs: 8&#10;TDP: 65W"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Prix de base (€)</Label>
                    <Input
                      id="basePrice"
                      name="basePrice"
                      type="number"
                      step="0.01"
                      defaultValue={editingComponent?.basePrice}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <select
                      id="category"
                      name="category"
                      defaultValue={editingComponent?.category?._id || ""}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inStock">Stock</Label>
                    <select
                      id="inStock"
                      name="inStock"
                      defaultValue={editingComponent?.inStock ?? true}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="true">En stock</option>
                      <option value="false">Rupture</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isActive">Statut</Label>
                    <select
                      id="isActive"
                      name="isActive"
                      defaultValue={editingComponent?.isActive ?? true}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="true">Actif</option>
                      <option value="false">Inactif</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingComponent ? "Modifier" : "Créer"}
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
