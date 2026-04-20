export class ApiResponse {
  static success(data, message = "Success", statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message = "Error", statusCode = 400, data = null) {
    return {
      success: false,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated(data, page, limit, total) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
