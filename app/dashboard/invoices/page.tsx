import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices',
};

type InvoicesProps = {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}

/**
 * The `Invoices` component renders a dashboard page for managing invoices.
 * 
 * ### Note on `useSearchParams` vs `props.searchParams`:
 * - `useSearchParams` is a React hook provided by Next.js for accessing query parameters in a client-side component. 
 *   It is useful when the component is not server-side rendered or when you need to reactively handle query parameter changes.
 * - `props.searchParams` is used in server-side rendered components or server actions in Next.js. 
 *   It provides access to query parameters directly from the server context, making it suitable for server-side logic.
 * 
 * As a general rule, if you want to read the params from the client, use the useSearchParams() hook as this avoids having to go back to the server.
 * 
 * In this case, `props.searchParams` is used because the component is an asynchronous server component, 
 * allowing it to fetch and process query parameters on the server before rendering.
 * 
 * @param props - The properties passed to the `Invoices` component.
 * @param props.searchParams - The query parameters from the URL, typically used for filtering or pagination.
 * @returns A JSX element representing the invoices dashboard page.
 */
export default async function Invoices(props: InvoicesProps) {
  
  const searchParams = await props.searchParams;
  const query = searchParams?.search || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}