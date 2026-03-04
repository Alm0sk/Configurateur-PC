import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { partnersAPI } from "../services/api";
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
import { Plus, Pencil, Trash2, X, Search, ExternalLink } from "lucide-react";

export function Partners() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { data: partners, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: () => partnersAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => partnersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["partners"]);
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => partnersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["partners"]);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => partnersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["partners"]);
    },
  });

  const openModal = (partner = null) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingPartner(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      url: formData.get("url"),
      description: formData.get("description"),
      contactEmail: formData.get("contactEmail"),
      isActive: formData.get("isActive") === "true",
    };

    if (editingPartner) {
      updateMutation.mutate({ id: editingPartner._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredPartners = partners?.filter(
    (partner) =>
      partner.name?.toLowerCase().includes(search.toLowerCase()) ||
      partner.url?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partenaires</h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Gérez les revendeurs partenaires"
              : "Consultez les revendeurs partenaires"}
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
                  <TableHead>Site web</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  {isAdmin && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners?.map((partner) => (
                  <TableRow key={partner._id}>
                    <TableCell className="font-medium">
                      {partner.name}
                    </TableCell>
                    <TableCell>
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {partner.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>{partner.contactEmail || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={partner.isActive ? "success" : "secondary"}
                      >
                        {partner.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModal(partner)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(partner._id)}
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
                {editingPartner
                  ? "Modifier le partenaire"
                  : "Nouveau partenaire"}
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
                    defaultValue={editingPartner?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Site web</Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    placeholder="https://..."
                    defaultValue={editingPartner?.url}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={editingPartner?.description}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    defaultValue={editingPartner?.contactEmail}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Statut</Label>
                  <select
                    id="isActive"
                    name="isActive"
                    defaultValue={editingPartner?.isActive ?? true}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingPartner ? "Modifier" : "Créer"}
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
