/// <reference types="jest" />
// __tests__/actions.test.ts
import { createInvoice, State } from '@/app/lib/actions';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

jest.mock('@vercel/postgres', () => ({
  sql: jest.fn(),
}));
jest.mock('next/cache');
jest.mock('next/navigation');

describe('createInvoice', () => {
  let formData: FormData;
  let prevState: State;

  beforeEach(() => {
    formData = new FormData();
    formData.append('customerId', '123');
    formData.append('amount', '50');
    formData.append('status', 'paid');
    
    prevState = {};
  });

  it('should return validation errors if form data is invalid', async () => {
    formData.delete('customerId'); // Make form data invalid
    const result = await createInvoice(prevState, formData);

    expect(result.errors).toBeDefined();
    expect(result.message).toBe('Missing Fields. Failed to Create Invoice.');
  });

  it('should return a database error if insertion fails', async () => {
    (sql as unknown as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));
    const result = await createInvoice(prevState, formData);

    expect(result.message).toBe('Database Error: Failed to Create Invoice.');
  });

  it('should call revalidatePath and redirect on success', async () => {
    (sql as unknown as jest.Mock).mockResolvedValueOnce({});
    await createInvoice(prevState, formData);

    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/invoices');
    expect(redirect).toHaveBeenCalledWith('/dashboard/invoices');
  });
});
