import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllProducts } from "@/sanity/lib/client";

const Home = async () => {
  const products = await getAllProducts();

  // const { randomProducts, winningIndex } = await getWheelOfFortuneConfiguration();

  return (
    <div>
      <SalesCampaignBanner />
      {/* <WheelOfFortune products={randomProducts} winningIndex={winningIndex} /> */}

      <section className="container mx-auto py-8">
        <ProductGrid products={products} />
      </section>
    </div>
  );
};

export default Home;
