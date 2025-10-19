import Header from "./Header";
import Footer from "./Footer";

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-clip nice-scrollbar">
      <Header />
      <main className="flex-1 bg-blue-800">
          <div className="glass p-6 sm:p-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
