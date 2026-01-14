import { ResourceNotFoundError } from "@/src/use-cases/errors/resource-not-found-error";
import { makeGetUserProfileUseCase } from "@/src/use-cases/factories/make-get-user-profile";
import { standardError, successResponse } from "@/src/utils/http-response";
import { NextRequest } from "next/server";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function GET(req: NextRequest) {
  const { user, error } = await verifyJWT()

  if (error) return error

  try {
    const getUserProfile = makeGetUserProfileUseCase()

    const { user: profile } = await getUserProfile.execute({
      userId: user!.id
    })

    return successResponse({ user: profile }, 200)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return standardError('RESOURCE_NOT_FOUND', 'User profile not found')
    }

    console.error('[GET /profile] Unexpected error:', err)
    return standardError('INTERNAL_SERVER_ERROR', 'An unexpected error occurred')
  }
}
