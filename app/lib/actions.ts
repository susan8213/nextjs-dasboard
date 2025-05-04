'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});
const CreateInvoiceFormData = InvoiceFormSchema.omit({ id: true, date: true });
const UpdateInvoiceFormData = InvoiceFormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const invoiceData = CreateInvoiceFormData.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = invoiceData.amount * 100; // Convert to cents
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoiceData.customerId}, ${amountInCents}, ${invoiceData.status}, ${date})
    `;

    // Revalidate the path to update the cache
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function updateInvoice(id: string, formData: FormData) {
    const invoiceData = UpdateInvoiceFormData.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = invoiceData.amount * 100; // Convert to cents

    await sql`
        UPDATE invoices
        SET customer_id = ${invoiceData.customerId},
            amount = ${amountInCents},
            status = ${invoiceData.status}
        WHERE id = ${id}
    `;

    // Revalidate the path to update the cache
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql`
        DELETE FROM invoices
        WHERE id = ${id}
    `;

    // Revalidate the path to update the cache
    revalidatePath('/dashboard/invoices');
}