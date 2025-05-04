import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data';

// 錯誤的寫法：
// 使用箭頭函式定義組件，雖然語法上沒有問題，但這種寫法可能導致 React DevTools 將組件名稱顯示為匿名函式，
// 並且在 Next.js 中可能因為伺服器端和客戶端渲染結果不一致而引發 hydration error。
// const Dashboard = () => {
//     return (
//         <div className="flex min-h-screen flex-col items-center justify-center p-24">
//             <h1 className="text-4xl font-bold">Dashboard</h1>
//             <p className="mt-4 text-lg">Welcome to the dashboard!</p>
//         </div>
//     );
// }
// export default Dashboard;


// 改進的寫法：
// 使用命名函式的方式定義組件，這樣可以提供穩定的函式名稱，避免 hydration error，
// 並且更符合 Next.js 的最佳實踐，讓框架更容易識別這是一個頁面組件。 
export default async function Dashboard() {
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();
    const { totalPaidInvoices, totalPendingInvoices, numberOfInvoices, numberOfCustomers } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue}  />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}