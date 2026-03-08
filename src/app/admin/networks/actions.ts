'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function upsertNetwork(formData: FormData) {
    const id = formData.get('id') as string | null;
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Optional fields
    const apiKey = (formData.get('apiKey') as string) || null;
    const trackingId = (formData.get('trackingId') as string) || null;

    if (!name) {
        throw new Error('Name is required');
    }

    try {
        if (id) {
            // Update existing
            await prisma.network.update({
                where: { id },
                data: {
                    name,
                    slug,
                    apiKey,
                    trackingId
                }
            });
        } else {
            // Create new
            await prisma.network.create({
                data: {
                    name,
                    slug,
                    apiKey,
                    trackingId
                }
            });
        }
    } catch (error) {
        console.error('Failed to upsert network:', error);
        throw new Error('Failed to save network configuration.');
    }

    revalidatePath('/admin/networks');
    redirect('/admin/networks');
}

export async function deleteNetwork(formData: FormData) {
    const id = formData.get('id') as string;

    if (!id) throw new Error('Network ID is required to delete');

    try {
        // Can't delete if there are deals attached normally, 
        // but for simplicity in this demo we'll let Prisma throw a foreign key error if deals exist.
        // It's safer to just set inactive, but the model doesn't have an isActive flag.
        await prisma.network.delete({
            where: { id }
        });
    } catch (error) {
        console.error('Failed to delete network:', error);
        throw new Error('Cannot delete network. Ensure no deals are attached to it first.');
    }

    revalidatePath('/admin/networks');
    redirect('/admin/networks');
}
