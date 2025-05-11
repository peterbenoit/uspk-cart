import { NextResponse } from 'next/server';
import { resend } from '@/lib/resendClient';

export async function POST(request) {
	try {
		// Parse form data
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const message = formData.get('message');

		// Prepare email data
		const emailData = {
			from: 'Contact Form <onboarding@resend.dev>',
			to: process.env.RECIPIENT_EMAIL || 'your-email@example.com', // Replace with the recipient email
			subject: `Contact Form Submission from ${name}`,
			html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
		};

		// Send email using Resend
		const { data, error } = await resend.emails.send(emailData);

		if (error) {
			console.error('Error sending email:', error);
			return NextResponse.json(
				{ error: 'Failed to send email' },
				{ status: 500 }
			);
		}

		// Redirect back to contact page with success status
		return NextResponse.redirect(new URL('/contact?success=true', request.url), {
			status: 303
		});
	} catch (error) {
		console.error('Error processing contact form:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
