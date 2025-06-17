import Footer from "../components/Footer";
import Header from "../components/Header";
import TaskManager from "../components/TaskManager";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <TaskManager />
      <Footer />
    </main>
  );
}
