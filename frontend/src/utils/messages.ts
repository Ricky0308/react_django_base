export const MESSAGES = {
  auth: {
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    signupSuccess: 'Signup successful',
    signupFailed: 'Signup failed',
    refreshSuccess: 'Token refresh successful',
    refreshFailed: 'Token refresh failed',
  },
  user: {
    listSuccess: 'Users listed successfully',
    listFailed: 'Failed to list users',
    detailsSuccess: 'User details retrieved successfully',
    detailsFailed: 'Failed to get user details',
    updateSuccess: 'User updated successfully',
    updateFailed: 'Failed to update user',
  },
  profile: {
    helloSuccess: 'Hello endpoint called successfully',
    helloFailed: 'Failed to call hello endpoint',
  },
  general: {
    apiError: (status: number) => `API error: ${status}`,
  },
}; 