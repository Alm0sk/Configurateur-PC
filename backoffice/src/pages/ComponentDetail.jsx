import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { componentsAPI, partnerPricesAPI } from "../services/api";
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
import { ArrowLeft, ExternalLink, Edit } from "lucide-react";

export function ComponentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: component, isLoading } = useQuery({
    queryKey: ["component", id],
    queryFn: () => componentsAPI.getById(id),
  });

  const { data: partnerPrices, isLoading: isLoadingPrices } = useQuery({
    queryKey: ["partnerPrices", id],
    queryFn: () => partnerPricesAPI.getByComponent(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!component) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/components")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Composant non trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/components")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button onClick={() => navigate(`/components`)}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Image et infos principales */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {component.image ? (
              <img
                src={component.image}
                alt={component.title}
                className="w-full h-auto rounded-lg border"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Aucune image</span>
              </div>
            )}
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Statut</span>
                <div className="mt-1">
                  <Badge variant={component.isActive ? "success" : "secondary"}>
                    {component.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Stock</span>
                <div className="mt-1">
                  <Badge
                    variant={component.inStock ? "default" : "destructive"}
                  >
                    {component.inStock ? "En stock" : "Rupture"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations détaillées */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{component.title}</CardTitle>
                <p className="text-muted-foreground mt-1">
                  {component.brand} • {component.model}
                </p>
              </div>
              <Badge variant="outline" className="text-lg">
                {component.category?.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                {component.description || "Aucune description disponible"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Prix de base</h3>
              <p className="text-2xl font-bold text-primary">
                {component.basePrice?.toFixed(2)} €
              </p>
            </div>

            {/* Spécifications techniques */}
            {component.specifications &&
              Object.keys(component.specifications).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Spécifications techniques
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(component.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-3 bg-muted rounded-lg"
                        >
                          <span className="font-medium">{key}</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Prix chez les partenaires */}
      <Card>
        <CardHeader>
          <CardTitle>Meilleurs prix chez nos partenaires</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPrices ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : partnerPrices && partnerPrices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partenaire</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerPrices
                  .sort((a, b) => a.price - b.price)
                  .map((partnerPrice, index) => (
                    <TableRow key={partnerPrice._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {partnerPrice.partner?.name}
                          {index === 0 && (
                            <Badge variant="success" className="text-xs">
                              Meilleur prix
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-lg font-bold">
                        {partnerPrice.price?.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            partnerPrice.inStock ? "default" : "secondary"
                          }
                        >
                          {partnerPrice.inStock ? "Disponible" : "Indisponible"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(partnerPrice.updatedAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {partnerPrice.affiliateLink && (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={partnerPrice.affiliateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Voir l'offre
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Aucun prix partenaire disponible pour ce composant
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
