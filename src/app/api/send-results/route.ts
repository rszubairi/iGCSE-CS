import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email, userName, examTitle, score, totalMarks, feedback } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Exam System <onboarding@resend.dev>',
      to: [email],
      subject: `Exam Results: ${examTitle}`,
      html: `
        <h1>Congratulations, ${userName}!</h1>
        <p>You have completed the exam: <strong>${examTitle}</strong></p>
        <p>Your Score: <strong>${score} / ${totalMarks}</strong></p>
        <hr />
        <h3>Feedback:</h3>
        <p>${feedback}</p>
        <p>Keep studying and good luck with your IGCSEs!</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
