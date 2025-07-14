import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { TitleBar } from "../components/TitleBar.tsx";

export default function Home() {
  const count = useSignal(3);
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <TitleBar />
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
        <Counter count={count} />
        <p style="margin-top: 1.5rem; font-size: 1.5rem; color:rgb(55, 79, 81);">
          Join Our Peer Circle
        </p>
        <p style="margin-top: 0.5rem; font-size: 1rem; color:rgb(81, 55, 55);">
          peer circle link here
        </p>
        <p style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(60, 55, 81);">
          Follow Us On Instagram for Online/Offline Events
        </p>
        <p style="margin-top: 0.5rem; font-size: 1rem; color:rgb(56, 81, 55);">
          instagram link here
        </p>
        <p style="margin-top: 10rem; font-size: 3rem; color:rgb(81, 55, 55);">
          Different Types of Loneliness
        </p>
        <p style="margin-top: 0.5rem; font-size: 1rem; color:rgb(81, 55, 55);">
          Companion Connect community—loneliness isn’t one single feeling. Young people tell us they can be in a crowded lunchroom, a late-night group chat, or even a relationship and still ache inside. Psychology pinpoints three distinct forms of loneliness that often overlap but need different fixes: &nbsp;
        <span style="color:rgb(0, 0, 0); font-weight: bold;">
          emotional, social, and existential
        </span>
          . Understanding which one is at play helps you choose the right tools—whether that’s finding a trusted confidant, joining a community, or digging into life’s big questions. Here’s how each type shows up for teens and college students, why it matters, and what you can do about it.
        </p>
        <hr class="w-full my-4" style="border-color: rgb(0, 0, 0); border-width: 2px;" />
        <p class="w-full" style="margin-top: 1rem; font-size: 2rem; color:rgb(81, 55, 55); text-align: left;">
          Why This Matters for Gen Z
        </p>
        <p style="margin-top: 0.5rem; font-size: 1rem; color:rgb(81, 55, 55);">
          Nearly 80 percent of Gen Z respondents said they felt lonely in a 2024 national survey, the highest of any generation. (
        <span style="color:rgb(56, 54, 188);">
          <a href="https://nypost.com/2025/07/12/lifestyle/poll-finds-gen-z-singles-are-giving-up-on-dating/?utm_source=chatgpt.com">New York Post</a>
        </span>
        <span style="color:rgb(81, 55, 55);">
          ) The U.S. Surgeon General warns that persistent loneliness raises depression, heart-disease, and premature-death risk as much as smoking up to 15 cigarettes a day. (
        </span>
        <span style="color:rgb(56, 54, 188);">
          <a href="https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf?utm_source=chatgpt.com">HHS.gov</a>
        </span>
        <span style="color:rgb(81, 55, 55);">
          ,&nbsp;
        </span>
        <span style="color:rgb(56, 54, 188);">
          <a href="https://nypost.com/2025/07/12/lifestyle/poll-finds-gen-z-singles-are-giving-up-on-dating/?utm_source=chatgpt.com">Extension | University of New Hampshire</a>
        </span>
        <span style="color:rgb(81, 55, 55);">
          ) Because adolescent brains are still wiring up the social–reward circuits, repeated loneliness can become self-perpetuating if nobody intervenes.(
        </span>
        <span style="color:rgb(56, 54, 188);">
          <a href="https://www.psychologytoday.com/us/blog/the-mysteries-of-love/202408/understanding-chronic-loneliness-in-adolescence?utm_source=chatgpt.com">Psychology Today</a>
        </span>
        <span style="color:rgb(81, 55, 55);">
          )
        </span>
        <hr class="w-full my-4" style="border-color: rgb(0, 0, 0); border-width: 2px;" />
        </p>
      </div>
    </div>
  );
}
