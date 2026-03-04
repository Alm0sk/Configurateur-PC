import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  componentsAPI,
  configurationsAPI,
  partnerPricesAPI,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
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
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  X,
  Plus,
} from "lucide-react";

export function ConfigurationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [selectedPriceOption, setSelectedPriceOption] = useState("base");
  const currentUserId = currentUser?.id || currentUser?._id;

  const {
    data: configuration,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["configuration", id],
    queryFn: () => configurationsAPI.getById(id),
    enabled: Boolean(id),
    retry: false,
  });
  const canLoadComponentCatalog = Boolean(currentUserId);

  const { data: components = [], isLoading: isLoadingComponents } = useQuery({
    queryKey: ["components"],
    queryFn: () => componentsAPI.getAll(),
    enabled: canLoadComponentCatalog,
  });

  const { data: partnerPrices = [], isLoading: isLoadingPartnerPrices } =
    useQuery({
      queryKey: ["partnerPrices", selectedComponentId],
      queryFn: () => partnerPricesAPI.getByComponent(selectedComponentId),
      enabled: Boolean(selectedComponentId) && canLoadComponentCatalog,
    });

  const deleteMutation = useMutation({
    mutationFn: (id) => configurationsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      navigate("/configurations");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => configurationsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration", id] });
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      setIsEditModalOpen(false);
    },
  });

  const addComponentMutation = useMutation({
    mutationFn: ({ configurationId, data }) =>
      configurationsAPI.addComponent(configurationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration", id] });
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      setSelectedComponentId("");
      setSelectedPriceOption("base");
    },
  });

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette configuration ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      status: formData.get("status"),
      isPublic: formData.get("isPublic") === "true",
      notes: formData.get("notes"),
    };
    updateMutation.mutate({ id, data });
  };

  const handleAddComponent = (e) => {
    e.preventDefault();

    if (!selectedComponent) {
      return;
    }

    if (selectedPriceOption === "base") {
      addComponentMutation.mutate({
        configurationId: id,
        data: {
          componentId: selectedComponent._id || selectedComponent.id,
          price: selectedComponent.basePrice ?? 0,
        },
      });
      return;
    }

    const selectedPartnerPrice = partnerPrices.find(
      (price) => price._id === selectedPriceOption,
    );

    if (!selectedPartnerPrice) {
      return;
    }

    addComponentMutation.mutate({
      configurationId: id,
      data: {
        componentId: selectedComponent._id || selectedComponent.id,
        partnerId:
          selectedPartnerPrice.partner?._id || selectedPartnerPrice.partner?.id,
        price: selectedPartnerPrice.price,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !configuration) {
    const isForbidden = error?.response?.status === 403;
    const errorMessage = isForbidden
      ? "Accès refusé. Vous n'avez pas les permissions pour consulter cette configuration."
      : "Configuration non trouvée";

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/configurations")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{errorMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const isAdmin = currentUser?.role === "admin";
  const configurationOwnerId =
    configuration?.user?._id || configuration?.user?.id || configuration?.user;
  const canEdit = isAdmin || configurationOwnerId === currentUserId;
  const canDelete = isAdmin || configurationOwnerId === currentUserId;
  const selectedComponent =
    components.find(
      (component) =>
        (component._id || component.id) === selectedComponentId,
    ) || null;
  const availableComponents = components.filter((component) => {
    const componentId = component._id || component.id;
    return !configuration.components?.some(
      (item) => (item.component?._id || item.component?.id) === componentId,
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/configurations")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        {canEdit && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            {canDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        )}
      </div>

      {/* En-tête de configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{configuration.name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {configuration.description || "Aucune description"}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant={getStatusVariant(configuration.status)}>
                {getStatusLabel(configuration.status)}
              </Badge>
              <Badge variant={configuration.isPublic ? "default" : "secondary"}>
                {configuration.isPublic ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Privé
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Utilisateur */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Créateur</div>
                <div className="font-medium">
                  {configuration.user?.firstName} {configuration.user?.lastName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {configuration.user?.email}
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Créé le</div>
                <div className="font-medium">
                  {new Date(configuration.createdAt).toLocaleDateString(
                    "fr-FR",
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Modifié le{" "}
                  {new Date(configuration.updatedAt).toLocaleDateString(
                    "fr-FR",
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Notes</div>
                <div className="font-medium text-sm">
                  {configuration.notes || "Aucune note"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un composant</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddComponent} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="componentId">Composant</Label>
                  <select
                    id="componentId"
                    value={selectedComponentId}
                    onChange={(e) => {
                      setSelectedComponentId(e.target.value);
                      setSelectedPriceOption("base");
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={isLoadingComponents || addComponentMutation.isPending}
                  >
                    <option value="">Sélectionner un composant</option>
                    {availableComponents.map((component) => (
                      <option
                        key={component._id || component.id}
                        value={component._id || component.id}
                      >
                        {component.title} - {component.brand}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceOption">Prix utilisé</Label>
                  <select
                    id="priceOption"
                    value={selectedPriceOption}
                    onChange={(e) => setSelectedPriceOption(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={
                      !selectedComponentId ||
                      isLoadingPartnerPrices ||
                      addComponentMutation.isPending
                    }
                  >
                    <option value="base">
                      Prix de base
                      {selectedComponent
                        ? ` - ${selectedComponent.basePrice?.toFixed(2)} €`
                        : ""}
                    </option>
                    {partnerPrices.map((price) => (
                      <option key={price._id} value={price._id}>
                        {price.partner?.name} - {price.price?.toFixed(2)} €
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedComponent && (
                <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                  <div className="font-medium">{selectedComponent.title}</div>
                  <div className="text-muted-foreground">
                    {selectedComponent.brand} {selectedComponent.model}
                  </div>
                  <div className="mt-2">
                    Catégorie : {selectedComponent.category?.name || "N/A"}
                  </div>
                </div>
              )}

              {selectedComponentId && partnerPrices.length === 0 && !isLoadingPartnerPrices && (
                <p className="text-sm text-muted-foreground">
                  Aucun prix partenaire disponible pour ce composant. Le prix de base sera utilisé.
                </p>
              )}

              {addComponentMutation.error && (
                <p className="text-sm text-destructive">
                  {addComponentMutation.error?.response?.data?.message ||
                    "Erreur lors de l'ajout du composant"}
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!selectedComponentId || addComponentMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter le composant
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des composants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Composants ({configuration.components?.length || 0})
            </CardTitle>
            <div className="text-2xl font-bold text-primary">
              Total: {configuration.totalCost?.toFixed(2)} €
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {configuration.components && configuration.components.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Composant</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Partenaire</TableHead>
                  <TableHead className="text-right">Sous-total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configuration.components.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {item.component?.title || "Composant inconnu"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.component?.brand} {item.component?.model}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.component?.category?.name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">×{item.quantity}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {item.price?.toFixed(2)} €
                    </TableCell>
                    <TableCell>
                      {item.selectedPartner?.name || (
                        <span className="text-muted-foreground">
                          Prix de base
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {(item.price * item.quantity).toFixed(2)} €
                    </TableCell>
                  </TableRow>
                ))}
                {/* Ligne de total */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={5} className="text-right">
                    Coût total
                  </TableCell>
                  <TableCell className="text-right text-lg text-primary">
                    {configuration.totalCost?.toFixed(2)} €
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Aucun composant dans cette configuration
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Récapitulatif par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif par catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configuration.components &&
              Object.entries(
                configuration.components.reduce((acc, item) => {
                  const category = item.component?.category?.name || "Autre";
                  if (!acc[category]) {
                    acc[category] = { count: 0, total: 0 };
                  }
                  acc[category].count += item.quantity;
                  acc[category].total += item.price * item.quantity;
                  return acc;
                }, {}),
              ).map(([category, data]) => (
                <div key={category} className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    {category}
                  </div>
                  <div className="text-lg font-bold">
                    {data.total.toFixed(2)} €
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data.count} composant{data.count > 1 ? "s" : ""}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Modifier la configuration</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={configuration.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={configuration.description}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    defaultValue={configuration.notes}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={configuration.status || "draft"}
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
                      defaultValue={configuration.isPublic ? "true" : "false"}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="true">Public</option>
                      <option value="false">Privé</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
