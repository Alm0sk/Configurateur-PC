import { useQuery } from '@tanstack/react-query';
import { usersAPI, categoriesAPI, componentsAPI, partnersAPI, configurationsAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, FolderTree, Cpu, Building2, Monitor } from 'lucide-react';

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  const { data: components } = useQuery({
    queryKey: ['components'],
    queryFn: () => componentsAPI.getAll(),
  });

  const { data: partners } = useQuery({
    queryKey: ['partners'],
    queryFn: () => partnersAPI.getAll(),
  });

  const { data: configurations } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => configurationsAPI.getAll(),
  });

  const stats = [
    {
      title: 'Utilisateurs',
      value: users?.length || 0,
      description: 'Comptes actifs',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Catégories',
      value: categories?.length || 0,
      description: 'Types de composants',
      icon: FolderTree,
      color: 'text-green-500',
    },
    {
      title: 'Composants',
      value: components?.length || 0,
      description: 'Produits disponibles',
      icon: Cpu,
      color: 'text-purple-500',
    },
    {
      title: 'Partenaires',
      value: partners?.length || 0,
      description: 'Revendeurs',
      icon: Building2,
      color: 'text-orange-500',
    },
    {
      title: 'Configurations',
      value: configurations?.length || 0,
      description: 'PC configurés',
      icon: Monitor,
      color: 'text-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre plateforme ConfigPC
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Composants récents</CardTitle>
            <CardDescription>Derniers composants ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {components?.slice(0, 5).map((component) => (
                <div
                  key={component._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{component.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {component.brand}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {component.basePrice?.toFixed(2)} €
                  </span>
                </div>
              ))}
              {(!components || components.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun composant
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partenaires</CardTitle>
            <CardDescription>Nos revendeurs partenaires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {partners?.map((partner) => (
                <div
                  key={partner._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{partner.name}</p>
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {partner.url}
                    </a>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      partner.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {partner.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              ))}
              {(!partners || partners.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun partenaire
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
