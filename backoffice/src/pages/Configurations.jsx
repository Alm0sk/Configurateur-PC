import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { configurationsAPI } from "../services/api";
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
import { Trash2, Search, Eye, FileText, Plus, X } from "lucide-react";

export function Configurations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const currentUserId = user?.id || user?._id;

  const { data: configurations, isLoading } = useQuery({
    queryKey: ["configurations", isAdmin],
    queryFn: () =>
      isAdmin ? configurationsAPI.getAllAdmin() : configurationsAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => configurationsAPI.create(data),
    onSuccess: (createdConfiguration) => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      setIsModalOpen(false);

      const createdConfigurationId =
        createdConfiguration?._id || createdConfiguration?.id;

      if (createdConfigurationId) {
        navigate(`/configurations/${createdConfigurationId}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => configurationsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
    },
  });

  const handleDelete = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette configuration ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    createMutation.mutate({
      name: formData.get("name"),
      description: formData.get("description"),
      notes: formData.get("notes"),
      isPublic: formData.get("isPublic") === "true",
      status: formData.get("status"),
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "finalized":
        return "success";
      case "archived":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "finalized":
        return "Finalisé";
      case "archived":
        return "Archivé";
      default:
        return "Brouillon";
    }
  };

  const filteredConfigurations = configurations?.filter((config) => {
    const matchesSearch =
      config.name?.toLowerCase().includes(search.toLowerCase()) ||
      config.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || config.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurations</h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Consultez les configurations PC créées par les utilisateurs"
              : "Créez et consultez vos configurations PC"}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle configuration
        </Button>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="finalized">Finalisé</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredConfigurations?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Aucune configuration</h3>
              <p className="text-muted-foreground">
                Les configurations créées par les utilisateurs apparaîtront ici.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Composants</TableHead>
                  <TableHead>Coût total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Visibilité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigurations?.map((config) => (
                  <TableRow key={config._id || config.id}>
                    <TableCell className="font-medium">{config.name}</TableCell>
                    <TableCell>
                      {config.user?.firstName} {config.user?.lastName}
                      <div className="text-xs text-muted-foreground">
                        {config.user?.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {config.components?.length || 0} composants
                      </Badge>
                    </TableCell>
                    <TableCell>{config.totalCost?.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(config.status)}>
                        {getStatusLabel(config.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={config.isPublic ? "default" : "secondary"}
                      >
                        {config.isPublic ? "Public" : "Privé"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            navigate(`/configurations/${config._id || config.id}`)
                          }
                          size="icon"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(isAdmin ||
                          (config.user?._id || config.user?.id || config.user) ===
                            currentUserId) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(config._id || config.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Nouvelle configuration</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <select
                      id="status"
                      name="status"
                      defaultValue="draft"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="finalized">Finalisé</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isPublic">Visibilité</Label>
                    <select
                      id="isPublic"
                      name="isPublic"
                      defaultValue="false"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="false">Privé</option>
                      <option value="true">Public</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    Créer
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
