import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { usersAPI, configurationsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { ArrowLeft, Edit, Mail, User, Calendar, Eye } from "lucide-react";

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => usersAPI.getById(id),
  });

  const { data: allConfigurations, isLoading: isLoadingConfigs } = useQuery({
    queryKey: ["configurations", currentUser?.role],
    queryFn: () =>
      currentUser?.role === "admin"
        ? configurationsAPI.getAllAdmin()
        : configurationsAPI.getAll(),
  });

  // Filtrer les configurations de l'utilisateur
  const userConfigurations = allConfigurations?.filter(
    (config) => config.user?._id === id || config.user === id,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Utilisateur non trouvé</p>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        {currentUser?.role === "admin" && (
          <Button onClick={() => navigate("/users")}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        )}
      </div>

      {/* Profil utilisateur */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rôle</span>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                >
                  {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant={user.isActive ? "success" : "destructive"}>
                  {user.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Inscrit le{" "}
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {userConfigurations?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Configuration{userConfigurations?.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {userConfigurations?.filter((c) => c.status === "finalized")
                    .length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Finalisée
                  {userConfigurations?.filter((c) => c.status === "finalized")
                    .length > 1
                    ? "s"
                    : ""}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {userConfigurations?.filter((c) => c.isPublic).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Publique
                  {userConfigurations?.filter((c) => c.isPublic).length > 1
                    ? "s"
                    : ""}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurations sauvegardées */}
      <Card>
        <CardHeader>
          <CardTitle>Configurations sauvegardées</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingConfigs ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : userConfigurations && userConfigurations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Composants</TableHead>
                  <TableHead>Coût total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Visibilité</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userConfigurations.map((config) => (
                  <TableRow key={config._id || config.id}>
                    <TableCell className="font-medium">{config.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {config.components?.length || 0} composants
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {config.totalCost?.toFixed(2)} €
                    </TableCell>
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
                    <TableCell className="text-muted-foreground">
                      {new Date(config.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(`/configurations/${config._id || config.id}`)
                        }
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Cet utilisateur n'a pas encore créé de configuration
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
