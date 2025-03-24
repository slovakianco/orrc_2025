import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Participants() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with actual data fetching
  const participants = [
    { id: 1, name: "John Doe", country: "USA", race: "33K", status: "confirmed" },
    { id: 2, name: "Jane Smith", country: "UK", race: "11K", status: "confirmed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-12 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-heading font-bold mb-4">
            {t("participants.title")}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl">
            {t("participants.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t("participants.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg border-2 border-gray-100 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      {t("participants.table.name")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      {t("participants.table.country")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      {t("participants.table.race")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      {t("participants.table.status")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {participants.map((participant) => (
                    <tr 
                      key={participant.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {participant.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {participant.country}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {participant.race}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          participant.status === "confirmed" 
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {t(`participants.status.${participant.status}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}