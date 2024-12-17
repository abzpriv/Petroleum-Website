import dynamic from "next/dynamic";

// Dynamically import the MenuBar component with SSR disabled
const MenuBar = dynamic(() => import("@/components/MenuBar"), { ssr: false });

const MenuBarPage = () => {
  return <MenuBar />;
};

export default MenuBarPage;
