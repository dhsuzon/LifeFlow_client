"use client";

import { featuredData } from "@/data/FeatureData";
import { Card } from "@heroui/react";

const FeaturedSection = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredData.map((item) => (
          <Card
            key={item.id}
            className="p-4 h-full flex flex-col justify-between text-center border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-700/20"
          >
            <Card.Header className="flex flex-col items-center gap-2">
              <div className="mb-2 text-danger text-3xl">{item.icon}</div>
              <Card.Title className="text-xl font-bold text-black dark:text-white">
                {item.title}
              </Card.Title>
              <Card.Description className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </Card.Description>
            </Card.Header>

            <Card.Content className="mt-4 text-gray-600 dark:text-gray-300">
              <p>{item.content}</p>
            </Card.Content>

            <Card.Footer className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 justify-center">
              <span className="text-danger font-semibold cursor-pointer hover:underline transition-all">
                Learn More →
              </span>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
