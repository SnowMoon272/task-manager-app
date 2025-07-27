import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { name } = await request.json();
    const token = request.cookies.get("auth-token")?.value;

    console.log("API Route - Token:", token ? "Present" : "Missing");
    console.log("API Route - Name:", name);

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const backendUrl = `${apiUrl}/api/users/profile`;

    console.log("Making request to:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
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
    console.error("Update profile API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

