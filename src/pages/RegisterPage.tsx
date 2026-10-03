import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { registerUser } from "../api/auth.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  validateEmail,
  validateName,
  validateRegisterPassword,
} from "../lib/validation";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  function handleNameChange(value: string) {
    setName(value);

    if (nameError) {
      setNameError(validateName(value));
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);

    if (emailError) {
      setEmailError(validateEmail(value));
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value);

    if (passwordError) {
      setPasswordError(validateRegisterPassword(value));
    }
  }

  function handleNameBlur() {
    setNameError(validateName(name));
  }

  function handleEmailBlur() {
    setEmailError(validateEmail(email));
  }

  function handlePasswordBlur() {
    setPasswordError(validateRegisterPassword(password));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validateRegisterPassword(password);

    setNameError(nameValidation);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (
      nameValidation ||
      emailValidation ||
      passwordValidation
    ) {
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      navigate("/login");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F8F7] px-5 py-12">
      <div className="w-full max-w-sm">

        {/* Heading */}
        <div className="-translate-y-4 mb-5 text-center">
          <p
            className="-mb-1.5 text-[11px] font-medium uppercase tracking-[0.22em]"
            style={{ color: "#946D6D" }}
          >
            Marketplace
          </p>
        </div>

        {/* Register Card */}
        <div className="relative">
          <Card
            className="border-0"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow:
                "0 20px 50px rgba(148, 109, 109, 0.10)",
            }}
          >
            <CardHeader className="px-7 pb-1 pt-3">
              <CardTitle
                className="text-center text-7xl font-bold"
                style={{
                  color: "#946D6D",
                  fontFamily: "'Estonia', cursive",
                }}
              >
                Create account
              </CardTitle>

              <CardDescription
                className="-mt-1 text-center text-xs"
                style={{ color: "#A290B7" }}
              >
                Create an account to start shopping.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-7 pb-7">
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >

                {/* Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium"
                    style={{ color: "#946D6D" }}
                  >
                    Name:
                  </Label>

                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={loading}
                    value={name}
                    onChange={(event) =>
                      handleNameChange(event.target.value)
                    }
                    onBlur={handleNameBlur}
                    required
                    aria-invalid={!!nameError}
                    className={`h-10 border-[#B0CDE6] bg-[#F4F8FC] shadow-none placeholder:text-[#A8A0AE] hover:bg-[#FDF4D2] focus-visible:border-[#A290B7] focus-visible:ring-[#A290B7] ${
                      nameError
                        ? "border-[#C84B5E] focus-visible:border-[#C84B5E] focus-visible:ring-[#C84B5E]"
                        : ""
                    }`}
                  />

                  {nameError && (
                    <p className="text-xs text-[#C84B5E]">
                      {nameError}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium"
                    style={{ color: "#946D6D" }}
                  >
                    Email:
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    value={email}
                    onChange={(event) =>
                      handleEmailChange(event.target.value)
                    }
                    onBlur={handleEmailBlur}
                    required
                    aria-invalid={!!emailError}
                    className={`h-10 border-[#B0CDE6] bg-[#F4F8FC] shadow-none placeholder:text-[#A8A0AE] hover:bg-[#FDF4D2] focus-visible:border-[#A290B7] focus-visible:ring-[#A290B7] ${
                      emailError
                        ? "border-[#C84B5E] focus-visible:border-[#C84B5E] focus-visible:ring-[#C84B5E]"
                        : ""
                    }`}
                  />

                  {emailError && (
                    <p className="text-xs text-[#C84B5E]">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium"
                    style={{ color: "#946D6D" }}
                  >
                    Password:
                  </Label>

                  <div className="relative">
                    <Input
                      id="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      disabled={loading}
                      value={password}
                      onChange={(event) =>
                        handlePasswordChange(
                          event.target.value
                        )
                      }
                      onBlur={handlePasswordBlur}
                      required
                      aria-invalid={!!passwordError}
                      className={`h-10 border-[#B0CDE6] bg-[#F4F8FC] pr-11 shadow-none placeholder:text-[#A8A0AE] hover:bg-[#FDF4D2] focus-visible:border-[#A290B7] focus-visible:ring-[#A290B7] ${
                        passwordError
                          ? "border-[#C84B5E] focus-visible:border-[#C84B5E] focus-visible:ring-[#C84B5E]"
                          : ""
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A290B7] transition hover:text-[#946D6D] disabled:opacity-50"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeClosed className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {passwordError && (
                    <p className="text-xs text-[#C84B5E]">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Server Error */}
                {error && (
                  <div className="rounded-lg bg-[#FCEBED] px-4 py-3">
                    <p className="text-sm text-[#C84B5E]">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-lg text-sm font-medium text-white shadow-sm transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "#946D6D",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              {/* Login */}
              <div className="mt-1 border-t border-[#B0CDE6]/50 pt-6 text-center">
                <p className="text-[11px] text-[#A290B7]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold underline-offset-4 hover:underline"
                    style={{
                      color: "#946D6D",
                    }}
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#A290B7]">
          A simple marketplace.
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;

