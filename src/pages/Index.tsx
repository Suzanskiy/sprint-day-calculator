import SprintCalculator from "@/components/SprintCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Sprint Planning Calculator
        </h1>
        <SprintCalculator />
      </div>
    </div>
  );
};

export default Index;