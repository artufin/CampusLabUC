import Image from "next/image";
import type { Opportunity } from "@/lib/types";

interface OpportunityListProps {
  opportunities: Opportunity[];
}

const OPPORTUNITY_ICON_SRC: Record<Opportunity["icon"], string> = {
  forest: "/assets/icons/forest.svg",
  tree: "/assets/icons/tree.svg",
  plant: "/assets/icons/plant.svg",
  germination: "/assets/icons/germination.svg",
};

export function OpportunityList({ opportunities }: OpportunityListProps) {
  const grouped = opportunities.reduce<Record<string, Opportunity[]>>(
    (acc, current) => {
      if (!acc[current.categoryName]) {
        acc[current.categoryName] = [];
      }

      acc[current.categoryName].push(current);
      return acc;
    },
    {},
  );

  const orderedGroups = Object.entries(grouped);

  return (
    <section className="opportunity-list">
      {orderedGroups.map(([category, groupItems]) => (
        <article key={category} className="opportunity-category-card">
          <h3>{category}</h3>

          <div className="opportunity-items">
            {groupItems.map((item) => (
              <div key={item.id} className="opportunity-item">
                <div className="opportunity-item-body">
                  <p className="opportunity-item-title">{item.title}</p>
                  <p>{item.description}</p>
                  <p className="opportunity-item-label">{item.label}</p>
                  <p className="opportunity-item-supervisor">
                    {item.supervisor}
                  </p>
                </div>

                <div className="opportunity-item-side">
                  <p>{item.typeLabel}</p>
                  <Image
                    src={OPPORTUNITY_ICON_SRC[item.icon]}
                    alt=""
                    width={46}
                    height={46}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
