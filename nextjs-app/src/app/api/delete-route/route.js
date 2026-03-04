// API route that deletes a saved route via Express server
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const { id } = await request.json();

        const response = await fetch(`${process.env.EXPRESS_URL}/api/routes/delete/${id}`, {
            method: "DELETE",
            headers: { "Cookie": `token=${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.message }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Delete route error:", error.message);
        return NextResponse.json({ error: "Failed to delete route" }, { status: 500 });
    }
}