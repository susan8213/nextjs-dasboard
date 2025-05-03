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
export default function Dashboard() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            {/* 標題部分，顯示 Dashboard 的標題 */}
            <h1 className="text-4xl font-bold">Dashboard</h1>
            
            {/* 描述部分，提供簡單的歡迎訊息 */}
            <p className="mt-4 text-lg">Welcome to the dashboard!</p>
        </div>
    );
}