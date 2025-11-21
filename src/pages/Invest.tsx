import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mockData";
import { useNavigate, useSearchParams } from "react-router-dom";

const riskColors = {
  1: "bg-green-100 text-green-800",
  2: "bg-green-100 text-green-800",
  3: "bg-yellow-100 text-yellow-800",
  4: "bg-yellow-100 text-yellow-800",
  5: "bg-orange-100 text-orange-800",
  6: "bg-red-100 text-red-800",
  7: "bg-red-100 text-red-800",
};

export default function Invest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get('type');
  const filterRisk = searchParams.get('risk');

  const filteredProducts = mockProducts.filter(product => {
    if (filterType && product.type !== filterType) return false;
    if (filterRisk && product.riskScore !== parseInt(filterRisk)) return false;
    return true;
  });

  const handleRequestProposal = (product: typeof mockProducts[0]) => {
    navigate('/recap', { state: { fromInvest: true, product } });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Investment Opportunities</h1>
        <p className="text-muted-foreground">
          Curated investment products from BNP Paribas Private Banking
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Profile</label>
            <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
              <option>All Profiles</option>
              <option>Defensive</option>
              <option>Balanced</option>
              <option>Dynamic</option>
              <option>Aggressive</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Horizon</label>
            <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
              <option>All Horizons</option>
              <option>0-2 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
              <option>All Themes</option>
              <option>Tech</option>
              <option>Climate</option>
              <option>Health</option>
              <option>Real Estate</option>
              <option>Private Equity</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Type</label>
            <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
              <option>All Types</option>
              <option>Funds</option>
              <option>Structured</option>
              <option>Cash</option>
              <option>Alternatives</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{product.type}</Badge>
                    <Badge className={riskColors[product.riskScore as keyof typeof riskColors]}>
                      Risk {product.riskScore}/7
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{product.description}</p>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                <div>
                  <p className="text-xs text-muted-foreground">Minimum Investment</p>
                  <p className="text-sm font-semibold">€{product.minTicket.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Horizon</p>
                  <p className="text-sm font-semibold">{product.horizon}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Theme</p>
                  <p className="text-sm font-semibold">{product.theme}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Performance</p>
                  <p className="text-sm font-semibold text-gain">{product.performance}</p>
                </div>
              </div>

              <Button 
                className="w-full bg-secondary hover:bg-secondary/90"
                onClick={() => handleRequestProposal(product)}
              >
                Request Proposal
              </Button>
            </div>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-muted-foreground">Aucun produit ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </div>
  );
}
