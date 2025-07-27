import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    const token = request.cookies.get("auth-token")?.value;

    console.log("Change Password API Route - Token:", token ? "Present" : "Missing");

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required" },
        { status: 400 },
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const backendUrl = `${apiUrl}/api/users/change-password`;

    console.log("Making request to:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    console.log("Backend response status:", response.status);

    let data;
    try {
      data = await response.json();
      console.log("Backend response data:", data);
    } catch (parseError) {
      console.error("Error parsing backend response:", parseError);
      return NextResponse.json(
        { success: false, message: "Error parsing backend response" },
        { status: 500 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Change password API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

