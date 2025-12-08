// components/category-sections/CategoryExtras.tsx
import HighlightsRow from "./HighlightsRow";
import DealOfDay from "./DealOfDay";
import SponsoredBrands from "./SponsoredBrands";
import BuyingGuide from "./BuyingGuide";
import ServiceFeatures from "./ServiceFeatures";
import Footer from "../layout/Footer";

export default function CategoryExtras() {
  return (
    <div className="space-y-8"> 
      <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
        <HighlightsRow />
      </div>
     <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
        <SponsoredBrands />
      </div>
       <div className="mt-10">
        <BuyingGuide />
      </div>


      {/* <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
        <BankOffers />

      </div> */}

    
    </div>
  );
}
