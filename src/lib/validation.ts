export function validateEmail(value: string) {
  if (!value.trim()) {
    return "Email is required.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value.trim())) {
    return "Please enter a valid email address.";
  }

  return "";
}

export function validateLoginPassword(value: string) {
  if (!value) {
    return "Password is required.";
  }

  return "";
}

export function validateRegisterPassword(value: string) {
  if (!value) {
    return "Password is required.";
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return "";
}

export function validateName(value: string) {
  if (!value.trim()) {
    return "Name is required.";
  }

  if (value.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }

  return "";
}

// Product validation 

export function validateProductName(value: string) {
  if (!value.trim()) {
    return "Product name is required.";
  }

  return "";
}

export function validateProductDescription(value: string) {
  if (!value.trim()) {
    return "Description is required.";
  }

  return "";
}

export function validateProductPrice(value: string) {
  if (!value.trim()) {
    return "Price is required.";
  }

  const numericPrice = Number(value);

  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    return "Price must be greater than 0.";
  }

  return "";
}

export function validateProductStock(value: string) {
  if (!value.trim()) {
    return "Stock quantity is required.";
  }

  const numericStock = Number(value);

  if (!Number.isInteger(numericStock)) {
    return "Stock must be a whole number.";
  }

  if (numericStock < 0) {
    return "Stock cannot be negative.";
  }

  return "";
}

export function validateProductCategory(value: string) {
  if (!value) {
    return "Please select a category.";
  }

  return "";
}

export function validateProductImages(
  existingImageCount: number,
  newImageCount: number
) {
  const totalImages =
    existingImageCount + newImageCount;

  if (totalImages === 0) {
    return "Please add at least one product image.";
  }

  if (totalImages > 10) {
    return "You can upload a maximum of 10 images.";
  }

  return "";
}

