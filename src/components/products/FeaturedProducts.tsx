import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

function FeaturedProductSection() {
  return (
    <section className="w-full">
      <div className="relative grid min-h-137.5 w-full grid-cols-1 md:grid-cols-2">

        {/* Left: Product description */}
        <div className="flex min-h-125 flex-col justify-center bg-[#FDF4D2] px-8 py-16 md:min-h-150 md:px-12 lg:px-20">

          <div className="-translate-y-14">

            <h2
              className="font-serif text-5xl leading-[0.75] text-[#552619] md:text-6xl lg:text-8xl"
              style={{ fontFamily: "'Estonia', cursive" }}
            >
              November
              <br />
              Special
            </h2>

            <div className="mt-16">

            <p
              className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#560319]"
              
            >
              A little something special for the season.
              <br />
              Discover our carefully selected 
              <br />
              collection of thoughtful gifts, 
              <br />
              made to celebrate
              <br />
              life's little moments.
            </p>
            </div>

            <div className="mt-16">
              <Button className="rounded-none bg-[#560319] px-7 py-6 text-xs tracking-widest text-white hover:bg-[#78223A]">
                DISCOVER COLLECTION
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

          </div>
        </div>

        {/* Right: Image */}
        <div className="relative min-h-100 overflow-hidden md:min-h-150pr">
          <img
            src="/images/pinacolada-perfume.jpg"
            alt="Summer collection"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Centre: Image */}
        <div className="absolute left-1/2 top-1/2 z-10 hidden h-46 w-46 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white shadow-xl md:block lg:h-56 lg:w-56">
          <img
            src="/images/84405.JPEG"
            alt="Featured product"
            className="h-full w-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}

export default FeaturedProductSection;

//hardcoded for now, admin should configure this section...
