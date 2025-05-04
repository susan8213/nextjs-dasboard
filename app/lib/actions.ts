'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than 0'}),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status',
    }),
    date: z.string(),
});
const CreateInvoiceFormData = InvoiceFormSchema.omit({ id: true, date: true });
const UpdateInvoiceFormData = InvoiceFormSchema.omit({ id: true, date: true });

export type InvoiceFormState = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };

export async function createInvoice(prevState: InvoiceFormState, formData: FormData) {
    const validatedFields = CreateInvoiceFormData.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
          };
    }

    const invoiceData = validatedFields.data;
    const amountInCents = invoiceData.amount * 100; // Convert to cents
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${invoiceData.customerId}, ${amountInCents}, ${invoiceData.status}, ${date})
        `;
    } catch (error) {
        throw new Error(`Failed to create invoice. (${error})`);
    }

    // Revalidate the path to update the cache
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function updateInvoice(
    id: string,
    prevState: InvoiceFormState,
    formData: FormData,
  ) {
    const validatedFields = UpdateInvoiceFormData.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
          };
    }

    const invoiceData = validatedFields.data;
    const amountInCents = invoiceData.amount * 100; // Convert to cents

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${invoiceData.customerId},
                amount = ${amountInCents},
                status = ${invoiceData.status}
            WHERE id = ${id}
        `;
    } catch (error) {
        throw new Error(`Failed to update invoice. (${error})`);
    }

    // Revalidate the path to update the cache
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`
            DELETE FROM invoices
            WHERE id = ${id}
        `;
    } catch (error) {   
        throw new Error(`Failed to delete invoice. (${error})`);
    }

    // Revalidate the path to update the cache
    revalidatePath('/dashboard/invoices');
}