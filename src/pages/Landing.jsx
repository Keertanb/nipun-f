import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, Star } from "lucide-react";
import Button from "../components/ui/Button";
import SkyDecor from "../components/illustrations/SkyDecor";
import {
  Star as StarDoodle,
  Balloon,
  Crayon,
  ABCBlock,
  SquiggleUnderline,
  ConfettiDots,
} from "../components/illustrations/Doodles";

// A soft, hand-drawn wave used between sections instead of a hard edge —
// gives the page the rounded, playful flow of a kids' storybook.
function WaveDivider({ color = "#ffffff", flip = false }) {
  return (
    <div className={flip ? "rotate-180" : ""} aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        className="w-full h-12 sm:h-20 block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 C 240 90 480 0 720 30 C 960 60 1200 10 1440 40 L1440 80 L0 80 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-leaf-50 to-sunny-50 overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-grid-dots -z-20" />
        <SkyDecor />
        <div className="relative max-w-7xl mx-auto w-full px-6 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-soft">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-sky-900 leading-none">
                Nipun Gujarat
              </p>
              {/* <p className="text-[11px] text-sky-700/60">Govt. of Gujarat</p> */}
            </div>
          </div>
          <Button size="sm" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-6 pt-6 pb-14 grid lg:grid-cols-[0.95fr_1.15fr] gap-10 items-center flex-1">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Soft colour blobs + confetti so the headline doesn't sit on bare white */}
            <div className="absolute -top-16 -left-20 w-72 h-72 bg-sunny-200/50 rounded-full blur-3xl -z-10" />
            <div className="absolute top-16 -left-10 w-64 h-64 bg-leaf-200/40 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 left-52 w-48 h-48 bg-sky-200/50 rounded-full blur-2xl -z-10" />
            <ConfettiDots className="hidden sm:block" />
            <StarDoodle
              className="w-6 h-6 -top-7 left-16 sm:left-40"
              color="#FFBE22"
              delay={0.2}
            />
            <Crayon
              className="w-6 h-16 -top-4 -left-3 hidden sm:block"
              color="#22A3F5"
              delay={0.5}
            />
            <ABCBlock
              className="w-9 h-9 top-2 right-2 sm:right-10 hidden sm:block"
              letter="A"
              color="#FA5411"
              delay={0.9}
            />

            {/* <span className="inline-block px-4 py-1.5 rounded-full bg-sunny-100 text-tangerine-700 text-xs font-bold mb-5">
              Government of Gujarat &middot; Balvatika to Standard 5
            </span> */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl xl:text-6xl leading-tight text-sky-900">
              Government of Gujarat
              <span className="block bg-gradient-to-r from-sky-500 via-leaf-500 to-tangerine-500 bg-clip-text text-transparent">
                Student Observation &amp; Review Portal
              </span>
            </h1>
            <SquiggleUnderline className="w-48 h-4 mt-1" color="#43CD82" />
            <p className="mt-4 text-lg text-sky-800/70 max-w-xl">
              A teacher-friendly digital platform for reviewing student
              development from Balvatika to Standard 5 &mdash; simple, joyful
              and built for every classroom in Gujarat.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                variant="sunny"
                icon={ArrowRight}
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
              >
                I&apos;m an Admin
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative px-2 py-4 lg:-mr-8 xl:-mr-16"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-sky-100 via-leaf-50 to-sunny-100 rounded-[40px] -z-20" />

            {/* Soft organic colour blobs peeking out from behind the photo */}
            <motion.div
              className="absolute -top-6 -right-2 w-40 h-40 bg-sunny-300/60 -z-10"
              style={{ borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%" }}
              animate={{ rotate: [0, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-6 -left-4 w-32 h-32 bg-leaf-300/50 rounded-full -z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <StarDoodle
              className="w-8 h-8 -top-2 left-4 sm:left-0"
              delay={0.2}
            />
            <Balloon
              className="w-10 h-20 -top-16 right-10 hidden sm:block"
              color="#FF7539"
              delay={0.6}
            />
            <ABCBlock
              className="w-11 h-11 bottom-2 -left-4 hidden sm:block"
              letter="B"
              color="#22B566"
              delay={1}
            />

            {/* Classroom photo, framed in a playful blob shape */}
            <div
              className="relative w-full aspect-[5/4] overflow-hidden shadow-xl border-[6px] border-white"
              style={{ borderRadius: "63% 37% 30% 70% / 50% 45% 55% 50%" }}
            >
              <img
                src="/images/classroom-hero.jpg"
                alt="A full classroom of Indian students learning together with their teacher"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/15 via-transparent to-transparent" />
            </div>

            {/* Sticker-style shape accents overlapping the photo edge */}
            <motion.div
              className="absolute -bottom-3 -right-3 sm:right-2 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-soft flex items-center justify-center rotate-6"
              animate={{ rotate: [6, -4, 6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <GraduationCap className="w-8 h-8 sm:w-9 sm:h-9 text-sky-500" />
            </motion.div>
            <motion.div
              className="absolute top-10 -left-3 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-sunny-400 shadow-soft flex items-center justify-center -rotate-6"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
            </motion.div>
          </motion.div>
        </div>

        <WaveDivider color="#ffffff" />
      </section>
    </div>
  );
}
