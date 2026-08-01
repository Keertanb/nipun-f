import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Star, ArrowLeft, GraduationCap, Shield } from "lucide-react";
import Button from "../components/ui/Button";
import LanguageToggle from "../components/ui/LanguageToggle";
import SkyDecor from "../components/illustrations/SkyDecor";
import {
  Star as StarDoodle,
  Balloon,
  Crayon,
  ABCBlock,
  SquiggleUnderline,
  ConfettiDots,
} from "../components/illustrations/Doodles";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

// A little smiling graduate face that peeks over the top edge of the
// login card — the "buddy" greeting whoever's signing in.
function PeekingBuddy({ className = "" }) {
  return (
    <motion.svg
      viewBox="0 0 100 78"
      className={className}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="50" cy="52" r="32" fill="#FFD24D" />
      <circle cx="50" cy="52" r="32" fill="url(#buddyGrad)" />
      <rect x="18" y="18" width="64" height="11" rx="5.5" fill="#144D74" />
      <rect x="44" y="8" width="14" height="12" rx="2" fill="#125A8C" />
      <circle cx="51" cy="8" r="3" fill="#FFD24D" />
      <circle cx="38" cy="54" r="4.5" fill="#144D74" />
      <circle cx="62" cy="54" r="4.5" fill="#144D74" />
      <path
        d="M36 65 Q50 74 64 65"
        stroke="#B75808"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="27" cy="58" r="6" fill="#FF9C6E" opacity="0.6" />
      <circle cx="73" cy="58" r="6" fill="#FF9C6E" opacity="0.6" />
      <defs>
        <radialGradient id="buddyGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE58A" />
          <stop offset="100%" stopColor="#F9A007" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

export default function Login() {
  const [role, setRole] = useState("teacher");
  const [showPass, setShowPass] = useState(false);
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { loginAsTeacher, loginAsAdmin } = useAuth();
  const { t } = useLanguage();

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (role === "teacher") {
      const code = teacherId.trim();
      if (!code) {
        setFormError(t("teacherIdPlaceholder"));
        return;
      }
      setSubmitting(true);
      try {
        await loginAsTeacher(code);
        navigate("/teacher");
      } catch (err) {
        setFormError(err.message || "Login failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    loginAsAdmin(username || "admin");
    navigate("/admin");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-100 via-leaf-50 to-sunny-50 px-4 py-14">
      <div className="absolute inset-0 bg-grid-dots -z-20" />
      <SkyDecor showBirds={false} />
      <ConfettiDots className="hidden sm:block" />

      {/* Grassy horizon strip, echoing the landing page's school scene */}
      <div
        className="absolute bottom-0 left-0 right-0 -z-10"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 140"
          className="w-full h-28 sm:h-36 block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 70 Q360 20 720 60 T1440 50 L1440 140 L0 140 Z"
            fill="#D5F9E2"
          />
          <path
            d="M0 78 Q360 30 720 68 T1440 58 L1440 140 L0 140 Z"
            fill="#AEF1C8"
          />
        </svg>
      </div>

      {/* Scattered doodles across the whole scene */}
      <StarDoodle
        className="w-7 h-7 top-[12%] left-[8%]"
        color="#FFBE22"
        delay={0.2}
      />
      <Balloon
        className="w-9 h-16 top-[8%] right-[10%] hidden sm:block"
        color="#FF7539"
        delay={0.6}
      />
      <Crayon
        className="w-6 h-16 bottom-[18%] left-[6%] hidden md:block"
        color="#22A3F5"
        delay={0.4}
      />
      <ABCBlock
        className="w-10 h-10 bottom-[22%] right-[8%] hidden md:block"
        letter="B"
        color="#22B566"
        delay={0.8}
      />
      <ABCBlock
        className="w-8 h-8 top-[20%] right-[18%] hidden lg:block"
        letter="A"
        color="#FA5411"
        delay={1.1}
      />
      <StarDoodle
        className="w-5 h-5 bottom-[28%] left-[20%] hidden lg:block"
        color="#22A3F5"
        delay={1.4}
      />

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-heading font-bold text-sky-700/70 hover:text-sky-900 transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" /> {t("home")}
      </Link>
      <div className="absolute top-6 right-6 z-10">
        <LanguageToggle />
      </div>

      {/* Polaroid snapshot of a real classroom, pinned beside the card */}
      <motion.div
        className="hidden xl:block absolute left-[6%] 2xl:left-[10%] top-1/2 -translate-y-1/2 w-72 z-10"
        initial={{ opacity: 0, y: 30, rotate: -14 }}
        animate={{ opacity: 1, y: 0, rotate: [-7, -4, -7] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.3 },
          y: { duration: 0.6, delay: 0.3 },
          rotate: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.9,
          },
        }}
        whileHover={{ rotate: 0, scale: 1.06 }}
      >
        <div className="relative bg-white p-4 pb-7 rounded-lg shadow-2xl">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-tangerine-500 border-[3px] border-white shadow-md" />
          <div className="overflow-hidden rounded-md">
            <img
              src="/images/classroom-login.jpg"
              alt="Young students learning together in a colourful Indian classroom"
              className="w-full h-56 object-cover"
            />
          </div>
          {/* <p className="text-center font-heading font-bold text-sm text-sky-800/70 mt-3">
            Real classrooms, real smiles 🎒
          </p> */}
          <motion.div
            className="absolute -bottom-4 -right-4 w-11 h-11 rounded-full bg-sunny-400 shadow-soft flex items-center justify-center -rotate-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star className="w-5 h-5 text-white fill-white" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo + greeting, floating above the card */}
        <div className="flex flex-col items-center text-center mb-2">
          {/* <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-soft mb-3"
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </motion.div> */}
          {/* <span className="inline-block px-3 py-1 rounded-full bg-sunny-100 text-tangerine-700 text-[11px] font-bold mb-1.5">
            Government of Gujarat
          </span> */}
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-sky-900 leading-tight drop-shadow-sm">
            {t("brand")}
          </h1>
          <p className="font-heading font-extrabold text-base sm:text-lg bg-gradient-to-r from-sky-500 via-leaf-500 to-tangerine-500 bg-clip-text text-transparent mt-0.5">
            {t("brandSub")}
          </p>
        </div>

        {/* Card, badge-style, with a buddy peeking over the top edge */}
        <div className="relative mt-8 rounded-[2rem] bg-white border-4 border-white shadow-2xl px-7 pt-14 pb-8">
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-20 h-16">
            <PeekingBuddy className="w-full h-full drop-shadow-md" />
          </div>

          <div className="text-center mb-6">
            <h1 className="font-heading font-extrabold text-2xl text-sky-900">
              {t("welcomeBackExclaim")}
            </h1>
            <SquiggleUnderline
              className="w-32 h-3.5 mx-auto mt-0.5"
              color="#43CD82"
            />
            <p className="text-sm text-sky-800/60 mt-2">
              {t("pickRole")}
            </p>
          </div>

          {/* Sliding pill role switcher */}
          <div className="relative flex bg-sky-50 rounded-full p-1.5 mb-6">
            {[
              { key: "teacher", label: t("teacher"), Icon: GraduationCap },
              { key: "admin", label: t("admin"), Icon: Shield },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`relative flex-1 py-2.5 rounded-full text-sm font-heading font-bold transition-colors ${
                  role === r.key
                    ? "text-white"
                    : "text-sky-700/70 hover:text-sky-900"
                }`}
              >
                {role === r.key && (
                  <motion.div
                    layoutId="roleActiveBg"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 shadow-soft"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 inline-flex items-center justify-center gap-1.5">
                  <r.Icon className="w-4 h-4" /> {r.label}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={role}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {role === "teacher" ? (
                <div>
                  <label className="text-xs font-semibold text-sky-800/70 mb-1 block">
                    {t("teacherId")}
                  </label>
                  <input
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value.slice(0, 50))}
                    placeholder={t("teacherIdPlaceholder")}
                    className="w-full rounded-2xl border-2 border-sky-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                    autoComplete="username"
                    required
                  />
                  <p className="text-[11px] text-sky-700/50 mt-1.5">
                    {t("teacherIdHint")}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold text-sky-800/70 mb-1 block">
                      {t("username")}
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin.gujarat"
                      className="w-full rounded-2xl border-2 border-sky-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-sky-800/70 mb-1 block">
                      {t("password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border-2 border-sky-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400"
                      >
                        {showPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {formError ? (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {formError}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="sunny"
                className="w-full"
                size="lg"
                icon={ArrowRight}
                disabled={submitting}
              >
                {submitting
                  ? t("signingIn")
                  : role === "teacher"
                    ? t("loginAsTeacher")
                    : t("loginAsAdmin")}
              </Button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
