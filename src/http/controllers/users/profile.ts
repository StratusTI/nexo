import { makeGetUserProfileUseCase } from "@/src-new/use-cases/facotires/make-get-user-profile";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function GET(request: NextRequest) {
  const { user, error } = await verifyJWT()

  if (error) return error

  try {
    const getUserProfile = makeGetUserProfileUseCase()

    const { user: profile } = await getUserProfile.execute({
      userId: user!.id
    })

    return NextResponse.json({
      user: profile
    })
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
 }
}
