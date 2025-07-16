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
        <p style="margin-top: 2rem; font-size: 3rem; color:rgb(81, 55, 55);">
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
        <p class="w-full" style="margin-top: 1rem; font-size: 2rem; color:rgb(81, 55, 55); text-align: left;">
          Emotional Loneliness
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          What it is
        </p>
        <p style="font-size: 1rem; color:rgb(81, 55, 55);">
          You lack a deep, trusting&nbsp;
        <span style="color:rgb(0, 0, 0); font-weight: bold;">
          one-to-one&nbsp;
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
           bond—someone you can text at 2 a.m. with the raw truth.(
        </span>   
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://www.sciencedirect.com/science/article/pii/S0190740924000148?utm_source=chatgpt.com">ScienceDirect</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          )
        </span>
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Why young people feel it
        </p>
        <p style="font-size: 1rem; color:rgb(81, 55, 55);">
          Break-ups, family conflict, or moving schools can suddenly remove a “go-to” person, leaving a vacuum no number of Snapchat streaks can fill.(
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11204807/?utm_source=chatgpt.com">PMC</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          ) Fear of judgment often keeps teens from opening up, so relationships stay surface-level.(
        </span>
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://www.apa.org/monitor/2025/04-05/teen-social-emotional-support?utm_source=chatgpt.com">American Psychological Association</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          )
        </span>
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Red flags
        </p>
        <p style="font-size: 1rem; color:rgb(81, 55, 55);">
          Bottling everything, feeling nobody “gets” you, or always playing the advice-giver without reciprocity are classic signs.(
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://www.sciencedirect.com/science/article/pii/S0190740924000148?utm_source=chatgpt.com">ScienceDirect</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          )
        </span>
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Quick wins
        </p>
        <ul style={{ paddingLeft: "2rem" }}>
          <li style={{ fontSize: "1.2rem", listStyleType: "disc" }}>
            <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
              Micro-vulnerability
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              : Share one honest feeling with a friend today—then notice who reciprocates.)
            </span>
          </li>
          <li style={{ fontSize: "1.2rem", listStyleType: "disc" }}>
            <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
              One trusted adult
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              : A coach, teacher, or counselor can buffer emotional loneliness even more than peers.(
            </span>
            <span style="font-size: 1rem; color:rgb(56, 54, 188);">
              <a href="https://www.apa.org/monitor/2025/04-05/teen-social-emotional-support?utm_source=chatgpt.com">American Psychological Association</a>
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              )
            </span>
          </li>
          <li style={{ fontSize: "1.2rem", listStyleType: "disc" }}>
            <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
              Professional help
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              : Therapy provides a safe “relationship lab” to practice openness.(
            </span>
            <span style="font-size: 1rem; color:rgb(56, 54, 188);">
              <a href="https://www.sciencedirect.com/science/article/pii/S0190740924000148?utm_source=chatgpt.com">ScienceDirect</a>
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              )
            </span>
          </li>
        </ul>
        <hr class="w-full my-4" style="border-color: rgb(0, 0, 0); border-width: 2px;" />
        <p class="w-full" style="margin-top: 1rem; font-size: 2rem; color:rgb(81, 55, 55); text-align: left;">
          Social Loneliness
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          What it is
        </p>
        <p class="w-full" style="font-size: 1rem; color:rgb(81, 55, 55); text-align: left;">
          You have no&nbsp;
        <span style="color:rgb(0, 0, 0); font-weight: bold;">
          group
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
           —no club, squad, or community where you feel you “fit.”(
        </span>   
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9346093/?utm_source=chatgpt.com">PMC</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          )
        </span>
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Why young people feel it
        </p>
        <p style="font-size: 1rem; color:rgb(81, 55, 55);">
          Transitions like starting college or switching friend groups can wipe out social networks overnight.(
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11204807/?utm_source=chatgpt.com">PMC</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          ) Remote classes and endless scrolling also replace in-person rituals that build belonging.(
        </span>
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf?utm_source=chatgpt.com">HHS.gov</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          )
        </span>
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Health impact
        </p>
        <p style="font-size: 1rem; color:rgb(81, 55, 55);">
          Social isolation in adolescence predicts higher anxiety, poorer sleep, and lower academic persistence years later.(
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9346093/?utm_source=chatgpt.com">PMC</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          )
        </span>
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Quick wins
        </p>
        <ul style={{ paddingLeft: "2rem" }}>
          <li style={{ fontSize: "1.2rem", listStyleType: "disc" }}>
            <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
              Consistent spaces
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              : Join something that meets weekly—sports, robotics, worship team—because repetition grows familiarity and trust.(
            </span>
            <span style="font-size: 1rem; color:rgb(56, 54, 188);">
              <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11204807/?utm_source=chatgpt.com">PMC</a>
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              )
            </span>
          </li>
          <li style={{ fontSize: "1.2rem", listStyleType: "disc" }}>
            <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
              Host, don’t hope
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              : Start a study circle or game night; being the organizer pulls people in.(
            </span>
            <span style="font-size: 1rem; color:rgb(56, 54, 188);">
              <a href="https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf?utm_source=chatgpt.com">HHS.gov</a>
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              )
            </span>
          </li>
          <li style={{ fontSize: "1.2rem", listStyleType: "disc" }}>
            <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
              Remove friction
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              : Lack of transportation or money? Ask a counselor or Companion Connect mentor about ride-shares or fee waivers—structural fixes matter.(
            </span>
            <span style="font-size: 1rem; color:rgb(56, 54, 188);">
              <a href="https://extension.unh.edu/blog/2022/05/prolonged-social-isolation-loneliness-are-equivalent-smoking-15-cigarettes-day?utm_source=chatgpt.com">Extension | University of New Hampshire</a>
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              )
            </span>
          </li>
        </ul>
        <hr class="w-full my-4" style="border-color: rgb(0, 0, 0); border-width: 2px;" />
        <p class="w-full" style="margin-top: 1rem; font-size: 2rem; color:rgb(81, 55, 55); text-align: left;">
          Existential Loneliness
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          What it is
        </p>
        <p class="w-full" style="font-size: 1rem; color:rgb(81, 55, 55); text-align: left;">
          A deep sense that no one can truly share your inner universe; it often pops up at 3 a.m. or after a loss.(   
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9553172/?utm_source=chatgpt.com">PMC</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          ,&nbsp;
        </span>
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10664587/?utm_source=chatgpt.com">PMC</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          )
        </span>
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Why young people feel it
        </p>
        <p style="font-size: 1rem; color:rgb(81, 55, 55);">
          Adolescence is when identity and meaning questions hit full force, magnifying this “cosmic” isolation.(
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9553172/?utm_source=chatgpt.com">PMC</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          ) Serious illness, family bereavement, or even pandemic headlines can trigger thoughts about mortality and purpose.(
        </span>
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10664587/?utm_source=chatgpt.com">PMC</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          )
        </span>
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Health impact
        </p>
        <p style="font-size: 1rem; color:rgb(81, 55, 55);">
          High existential isolation correlates with sharper spikes in depression and self-harm ideation than social loneliness alone.(
        <span style="font-size: 1rem; color:rgb(56, 54, 188);">
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10664587/?utm_source=chatgpt.com">PMC</a>
        </span>
        <span style="font-size: 1rem; color:rgb(81, 55, 55);">
          )
        </span>
        </p>
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Quick wins
        </p>
        <ul style={{ paddingLeft: "2rem" }}>
          <li style={{ fontSize: "1.2rem", listStyleType: "disc" }}>
            <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
              Meaning log
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              : Each night, jot one moment that felt purposeful—helped a friend, aced a sketch, finished a workout. Over weeks this builds an antidote narrative.(
            </span>
            <span style="font-size: 1rem; color:rgb(56, 54, 188);">
              <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10664587/?utm_source=chatgpt.com">PMC</a>
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              )
            </span>
          </li>
          <li style={{ fontSize: "1.2rem", listStyleType: "disc" }}>
            <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
              Existential chats
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              : Discuss big questions in youth group, philosophy club, or with a therapist; naming the void decreases its power.
            </span>
          </li>
          <li style={{ fontSize: "1.2rem", listStyleType: "disc" }}>
            <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
              Embodied awe
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              : 20-minute phone-free nature walks reduce rumination and boost connectedness.(
            </span>
            <span style="font-size: 1rem; color:rgb(56, 54, 188);">
              <a href="https://www.psychologytoday.com/us/blog/the-mysteries-of-love/202408/understanding-chronic-loneliness-in-adolescence?utm_source=chatgpt.com">Psychology Today</a>
            </span>
            <span style="font-size: 1rem; color:rgb(81, 55, 55);">
              )
            </span>
          </li>
        </ul>
        <p class="w-full" style="margin-top: 1rem; font-size: 2rem; color:rgb(81, 55, 55); text-align: left;">
          How Companion Connect Can Help
        </p>
        <ul style={{ paddingLeft: "2rem" }}>
          <li><span style={{ fontSize: "2rem", color:"rgb(0, 0, 0)" }}>1.</span>
              <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
                Peer Circles&nbsp;
              </span>
              <span style="font-size: 1rem; color:rgb(81, 55, 55);">
                – Small, weekly video groups that blend emotional check-ins and goal-setting, giving you both confidants and a tribe.
              </span>
          </li>
          <li><span style={{ fontSize: "2rem", color:"rgb(0, 0, 0)" }}>2.</span>
              <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
                AI Mood Check App&nbsp;
              </span>
              <span style="font-size: 1rem; color:rgb(81, 55, 55);">
                Private journaling prompts that spot early warning signs of any loneliness type and nudge you toward support.
              </span>
          </li>
          <li><span style={{ fontSize: "2rem", color:"rgb(0, 0, 0)" }}>3.</span>
              <span style="font-size: 1rem; color:rgb(0, 0, 0); font-weight: bold;">
                Purpose Projects&nbsp;
              </span>
              <span style="font-size: 1rem; color:rgb(81, 55, 55);">
                – Volunteer teams where you can turn existential questions into real-world impact.
              </span>
          </li>
        </ul>
        <hr class="w-full my-4" style="border-color: rgb(0, 0, 0); border-width: 2px;" />
        <p class="w-full" style="margin-top: 0.5rem; font-size: 1.5rem; color:rgb(81, 55, 55); text-align: left;">
          Takeaway
        </p>
        <p style="font-size: 1rem; color:rgb(81, 55, 55);">
          Loneliness isn’t a single switch—it’s a spectrum. Emotional, social, and existential gaps all hurt in different ways, but each can be bridged with the right mix of vulnerability, community, and meaning. If any of these descriptions hit home, reach out—whether to a friend, counselor, or Companion Connect. No one else can live your life, but none of us has to brave it entirely alone.
        </p>
      </div>
    </div>
  );
}
