import HeroSlider from "@/components/home/HeroSlider";
import WhyLearningMatters from "@/components/home/WhyLearningMatters";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <WhyLearningMatters />
    </main>
  );
}
