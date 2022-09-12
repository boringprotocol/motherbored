import Header from "./header";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}
