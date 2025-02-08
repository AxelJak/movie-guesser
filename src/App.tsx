import { Route, Switch } from "wouter";
import Start from "@/Start";
import Room from "@/pages/room/Room";
import AdminLayout from "@/components/admin/AdminLayout";

export default function App() {

  return (
    <main className="bg-gray-100" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100vw", height: "100vh" }}>
      <Switch>
        <Route path="/" component={Start} />
        <Route path="/room/:roomKey" component={Room} />
        <Route path="/admin" component={AdminLayout} />
        <Route path="/admin/*" component={AdminLayout} />
      </Switch> 
    </main>
  );
}
