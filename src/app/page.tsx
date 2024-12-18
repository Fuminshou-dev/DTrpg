"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const githubIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    id="Github-Alt--Streamline-Unicons"
  >
    <desc>{"Github Alt Streamline Icon: https://streamlinehq.com"}</desc>
    <path
      d="M10.0703 20.5029c0 -0.1466 -0.0323 -0.2915 -0.09452 -0.4243 -0.06225 -0.1328 -0.15294 -0.2502 -0.26564 -0.3441 -0.11271 -0.0938 -0.24468 -0.1617 -0.38655 -0.1989 -0.14188 -0.0371 -0.29018 -0.0426 -0.43442 -0.0161 -1.30908 0.2403 -2.96191 0.2764 -3.40137 -0.958 -0.38319 -0.956 -1.01793 -1.7904 -1.83691 -2.415 -0.05843 -0.0317 -0.11412 -0.0683 -0.1665 -0.1093 -0.07167 -0.1891 -0.19899 -0.352 -0.36514 -0.4673 -0.16614 -0.1152 -0.36333 -0.1774 -0.56553 -0.1783h-0.00488c-0.2644 0 -0.51807 0.1046 -0.70549 0.2911 -0.18741 0.1865 -0.29331 0.4397 -0.29451 0.7041 -0.00391 0.8154 0.811 1.3379 1.1416 1.5146 0.38985 0.3917 0.70315 0.8527 0.92383 1.3594 0.36426 1.0234 1.42285 2.5762 4.46582 2.376 0.001 0.0351 0.00195 0.0683 0.00244 0.0986l0.00439 0.2676c0 0.2652 0.10536 0.5196 0.2929 0.7071 0.18753 0.1875 0.44189 0.2929 0.7071 0.2929 0.26522 0 0.51957 -0.1054 0.70711 -0.2929 0.18754 -0.1875 0.29287 -0.4419 0.29287 -0.7071l-0.0049 -0.3184c-0.0048 -0.1895 -0.0117 -0.4639 -0.0117 -1.1817Zm10.667 -15.12596c0.0318 -0.125 0.063 -0.26367 0.0904 -0.41992 0.1617 -1.11441 0.0207 -2.25181 -0.4082 -3.293 -0.0542 -0.13574 -0.1373 -0.25799 -0.2437 -0.3582 -0.1064 -0.1002 -0.2333 -0.17593 -0.3721 -0.22187 -0.356 -0.120122 -1.6704 -0.356452 -4.184 1.25 -2.0895 -0.49171 -4.2646 -0.49171 -6.35405 0C6.76222 0.751028 5.4546 0.965828 5.10206 1.07911c-0.14213 0.04408 -0.2726 0.1194 -0.38185 0.22046 -0.10924 0.10105 -0.19449 0.22526 -0.2495 0.36354 -0.4377 1.06118 -0.57716 2.22177 -0.40332 3.35644 0.02442 0.12793 0.05078 0.2461 0.07813 0.35449 -0.82843 1.10344 -1.26969 2.44936 -1.25537 3.8291 -0.0027 0.30783 0.01148 0.61559 0.04248 0.92186 0.334 4.6025 3.334 5.9844 5.42431 6.459 -0.04345 0.125 -0.083 0.2588 -0.11816 0.4004 -0.06266 0.2573 -0.02073 0.5289 0.1166 0.7554 0.13733 0.2264 0.35884 0.3891 0.61597 0.4525 0.25713 0.0633 0.52889 0.0221 0.75568 -0.1146 0.22679 -0.1367 0.39007 -0.3578 0.45417 -0.6148 0.0636 -0.3332 0.2267 -0.6393 0.4677 -0.8779 0.1458 -0.1276 0.2513 -0.2948 0.3038 -0.4813 0.0525 -0.1865 0.0496 -0.3842 -0.0082 -0.5691 -0.0579 -0.1849 -0.1682 -0.349 -0.3176 -0.4723 -0.1494 -0.1234 -0.3314 -0.2006 -0.5239 -0.2224 -3.45406 -0.3946 -4.95358 -1.8018 -5.17916 -4.89847 -0.02499 -0.24527 -0.03623 -0.49175 -0.03369 -0.73828 -0.01604 -0.98335 0.30883 -1.94192 0.91943 -2.71289 0.06136 -0.08038 0.1267 -0.15763 0.1958 -0.23145 0.12243 -0.137 0.20475 -0.30508 0.23792 -0.4858 0.03316 -0.18071 0.01589 -0.36707 -0.04992 -0.53861 -0.06746 -0.18047 -0.11941 -0.36637 -0.15527 -0.55567 -0.08147 -0.53829 -0.05474 -1.08741 0.0786 -1.61524 0.86914 0.24547 1.68712 0.64504 2.415 1.17968 0.12037 0.08017 0.25657 0.13353 0.39937 0.15644 0.1428 0.02292 0.28886 0.01486 0.42827 -0.02362 2.02115 -0.5485 4.15195 -0.54816 6.17285 0.001 0.1402 0.03844 0.287 0.04604 0.4304 0.02227 0.1434 -0.02377 0.2799 -0.07835 0.4002 -0.15996 0.7244 -0.53686 1.539 -0.94 2.4052 -1.19043 0.1328 0.51515 0.1625 1.05145 0.0874 1.57812 -0.0362 0.20754 -0.0928 0.411 -0.1689 0.60743 -0.0658 0.17154 -0.0831 0.3579 -0.0499 0.53861 0.0331 0.18072 0.1155 0.3488 0.2379 0.4858 0.0771 0.08691 0.1543 0.18066 0.2236 0.26855 0.6063 0.75792 0.9257 1.70547 0.9019 2.67576 0.0018 0.25961 -0.0107 0.51912 -0.0376 0.77734 -0.2202 3.05562 -1.7256 4.46382 -5.1958 4.85932 -0.1925 0.022 -0.3746 0.0994 -0.5239 0.2228 -0.1494 0.1235 -0.2597 0.2877 -0.3174 0.4727 -0.0578 0.1849 -0.0606 0.3827 -0.0081 0.5693 0.0526 0.1865 0.1582 0.3537 0.304 0.4813 0.2486 0.2451 0.4121 0.5634 0.4663 0.9082 0.0676 0.2677 0.0986 0.5434 0.0923 0.8194v2.334c-0.0098 0.6474 -0.0098 1.1328 -0.0098 1.3554 0 0.2653 0.1054 0.5196 0.2929 0.7071 0.1875 0.1876 0.4419 0.2929 0.7071 0.2929 0.2652 0 0.5196 -0.1053 0.7071 -0.2929 0.1876 -0.1875 0.2929 -0.4418 0.2929 -0.7071 0 -0.2168 0 -0.6923 0.0098 -1.3398v-2.3496c0.008 -0.4422 -0.044 -0.8834 -0.1548 -1.3115 -0.0317 -0.1406 -0.0705 -0.2794 -0.1162 -0.416 1.5212 -0.2528 2.9035 -1.0371 3.9006 -2.2134 0.9971 -1.1764 1.5445 -2.6684 1.5447 -4.2105 0.0329 -0.31855 0.0483 -0.6387 0.0459 -0.95896 0.0222 -1.38123 -0.4227 -2.7295 -1.2627 -3.8262Z"
      fill="#000000"
      strokeWidth={1}
    />
  </svg>
);
export default function Home() {
  const { isSignedIn } = useAuth();
  const [isExplainRules, setExplainRules] = useState(false);
  const router = useRouter();
  const [isAdult, setIsAdult] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setIsAdult(false);
    }
    if (isSignedIn) {
      setIsAdult(true);
    }
  }, [isSignedIn, setIsAdult]);

  return (
    <div className="min-h-screen w-full container mx-auto relative px-4 py-8">
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={"https://github.com/Fuminshou-dev/dprpg"}
        className="absolute top-4 right-4 z-10"
      >
        <div className="size-8 sm:size-12 rounded-lg p-2 sm:p-4 border border-black border-spacing-12 dark:bg-white">
          {githubIcon}
        </div>
      </Link>
      <AlertDialog defaultOpen={true} open={!isAdult}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you 18 or older?</AlertDialogTitle>
            <AlertDialogDescription>
              The content on this page is for adults only.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Link href="https://google.com/">Leave</Link>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsAdult(true);
              }}
            >
              I am 18 or older
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div
        className={`${
          isAdult ? "" : "blur"
        } min-h-screen flex flex-col justify-center items-center gap-8`}
      >
        <div className="flex flex-col gap-6 sm:gap-8 justify-center items-center text-center tracking-tighter max-w-4xl">
          <h1 className="text-3xl sm:text-5xl">DT RPG GAME</h1>
          <h2 className="text-lg sm:text-2xl">
            Monsters are attacking! Over 100 years have passed since the{" "}
            <span className="text-red-500">Demon Queen</span> was defeated by
            the <span className="text-yellow-200">Hero</span>. Now, the world is
            once again on the brink of falling into
            <span className="text-gray-200 italic"> darkness</span>. You are a
            descendant of the <span className="text-yellow-200">Hero</span> who
            vanquished the <span className="text-red-500">Demon Queen</span> a
            century ago, and you have inherited his{" "}
            <span className="font-bold">special power</span>. It allows you to
            incapacitate monsters by making them ejaculate with your throat. The
            monsters are now trying to summon an{" "}
            <span className="text-red-500 italic">evil deity</span> to solidify
            their control over the world. Defeat the{" "}
            <span className="text-red-500">Dark Priest</span> and stop the
            summoning of the <span className="text-red-500">evil deity</span>.
          </h2>
          <h3 className="text-xl sm:text-3xl">
            Only <span className="font-bold italic">you</span> can save the
            world.
          </h3>
        </div>
        <Button
          variant={"secondary"}
          size={"lg"}
          onClick={() => {
            if (!isSignedIn) {
              setExplainRules(true);
            } else {
              router.push("/main");
            }
          }}
          className="text-base sm:text-lg"
        >
          Start the game
        </Button>
      </div>
      <AlertDialog open={isExplainRules}>
        <AlertDialogContent className="max-w-lg h-full overflow-y-scroll sm:h-fit sm:max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl sm:text-2xl">
              The rules of the game
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col gap-4 text-center text-sm sm:text-base">
              <span className="text-lg sm:text-xl font-semibold">
                Your goal
              </span>
              <span>
                Your goal is to defeat the{" "}
                <span className="text-red-500">Dark Priest</span> and stop the
                summoning of the{" "}
                <span className="text-red-500">evil deity</span>. Defeat
                monsters, level up, and aim to bring down the{" "}
                <span className="text-red-500">Dark Priest</span>.
              </span>
              <span className="text-lg sm:text-xl font-semibold">Battle</span>
              <span>
                In battle, if you reduce the monster's{" "}
                <span className="text-blue-500">HP</span> to zero before your
                own <span className="text-blue-500">HP</span> reaches zero,{" "}
                <span className="text-green-500">you win</span>. Battles always
                start with both the monster and you at full{" "}
                <span className="text-blue-500">HP</span>. After winning a
                battle, you will gain{" "}
                <span className="text-purple-500">EXP</span> and{" "}
                <span className="text-yellow-400">Gold</span> (currency) based
                on the monster you defeated. Once you earn enough{" "}
                <span className="text-purple-500">EXP</span>, you will level up,
                and your <span className="text-blue-500">HP</span> and base
                attack power will increase.
                <br />
                You can battle any monster you've defeated as many times as you
                like. If an enemy is too strong to defeat, fight previously
                defeated monsters to level up.
              </span>
              <span className="text-lg sm:text-xl font-semibold">Shop</span>
              <span>
                In the shop, you can buy items that will aid you in battle. You
                can earn <span className="text-yellow-400">money</span> by
                defeating monsters or working at the brothel.
              </span>
              <span className="text-lg sm:text-xl font-semibold">Brothel</span>
              <span>
                In the brothel, unlike in battle, you won't gain{" "}
                <span className="text-purple-500">EXP</span>, but you can earn
                more <span className="text-yellow-400">Gold</span> than you
                would from battle. You can work at the brothel as many times as
                you like during your adventure.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExplainRules(false)}>
              Go back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setExplainRules(false);
                router.push("/main");
              }}
            >
              Got it, let's go.
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
