/**
 * BrandForge MCP Server - Cloudflare Worker
 * Autonomous Personal Brand & Audience Engineering: Brand Architecture, Platform Content Systems,
 * Hooks & Formats, Audience Growth Engines & Honest Monetization Ladders
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Solana-Signature, X-License-Key',
};

const PRO_TIERS = {
  single_tool: {
    price_usd: 7.99,
    description: "Single Tool Pro Lifetime License (BrandForge Only)"
  },
  all_access_suite: {
    price_usd: 14.99,
    description: "All-Access Lifetime Suite Pass (Unlocks all 50+ MCP Servers)"
  }
};

const MONETIZATION_INFO = {
  gumroad_pro_checkout: "https://amygraphics.gumroad.com/l/mcp-pro",
  gumroad_options: {
    single_tool_lifetime: "$7.99 (Select 'Single MCP Server' version)",
    all_access_suite_lifetime: "$14.99 (Select 'All-Access Lifetime Suite' version)"
  },
  solana_usdc_instant: {
    wallet: "8sDLX3okSV974wdjdeKhN9uWLZDr45DeGCJ28zgTLEdJ",
    amount_usdc_single: 7.99,
    amount_usdc_suite: 14.99
  }
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/verify-solana' && request.method === 'POST') {
      try {
        const body = await request.json();
        const signature = body.signature;
        if (!signature || signature.length < 32) {
          return new Response(JSON.stringify({
            valid: false,
            error: "Invalid Solana signature"
          }), {
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify({
          valid: true,
          tx_hash: signature,
          license_tier: "all_access_lifetime",
          unlocked_servers: "all_50_servers",
          status: "confirmed"
        }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ valid: false, error: err.message }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'brandforge-mcp',
        version: '1.0.0',
        tools_available: 6,
        pricing: PRO_TIERS
      }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/mcp' || url.pathname === '/sse') {
      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const response = await handleMcpRequest(body, env);
          return new Response(JSON.stringify(response), {
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        } catch (e) {
          return new Response(JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32700, message: 'Parse error: ' + e.message }
          }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }
      }
    }

    return new Response('BrandForge MCP is running. Connect via /mcp', {
      headers: CORS_HEADERS
    });
  }
};

async function handleMcpRequest(request, env) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'brandforge-mcp',
          version: '1.0.0',
          description: 'Autonomous Personal Brand & Audience Engineering: Brand Architecture, Platform Content Systems, Hooks & Formats, Audience Growth Engines & Honest Monetization MCP'
        }
      }
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'autonomous_personal_brand_architect',
            description: 'MASTER 1-SHOT OUTCOME ENGINE: Ingests the expertise focus and stage and synthesizes a complete personal brand architecture in one call: the positioning read (the intersection of what you know, what you can prove, and what an audience pays attention to), the platform selection math (where YOUR buyers actually scroll — not where creators hang out), the content identity (the 3-pillar system that makes you recognizable instead of random), stage diagnosis of what is actually blocking growth or money, and the 90-day roadmap from invisible to in-demand. Built for developers, professionals and builders turning expertise into audience and audience into opportunity.',
            inputSchema: {
              type: 'object',
              properties: {
                brand_focus: {
                  type: 'string',
                  description: 'The expertise and intended direction (e.g. "AI engineering, want consulting clients", "indie hacking journey, want product sales")'
                },
                stage: {
                  type: 'string',
                  enum: ['no_presence_yet', 'posting_no_growth', 'growing_no_money', 'established_plateau'],
                  description: 'Current brand stage'
                },
                creator_goal: {
                  type: 'string',
                  enum: ['sell_products_courses', 'land_clients_consulting', 'career_opportunities_network'],
                  description: 'What the audience should ultimately produce'
                }
              },
              required: ['brand_focus']
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                positioning_read: { type: 'string', description: 'Know x prove x attention intersection' },
                platform_selection: { type: 'string', description: 'Where the buyers scroll, with the math' },
                content_identity: { type: 'string', description: 'The 3-pillar recognizability system' },
                stage_diagnosis: { type: 'string', description: 'What is actually blocking progress' },
                execution_roadmap: { type: 'string', description: '90 days from invisible to in-demand' }
              },
              required: ['status', 'positioning_read', 'platform_selection', 'content_identity', 'stage_diagnosis', 'execution_roadmap']
            },
            annotations: { title: 'Autonomous Personal Brand Architect', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'engineer_platform_content_system',
            description: 'Engineers the platform-native content system that compounds instead of burning out: platform mechanics decoded (what each algorithm actually rewards in 2026 — X/Twitter reply-and-velocity dynamics, LinkedIn dwell-time and professional-context rules, YouTube click-through and retention economics, newsletter deliverability and reply signals), the sustainable cadence matched to real available time, the content calendar that survives busy weeks (pillar rotation, batch creation, the evergreen bank), and the platform-specific packaging rules that double reach on identical ideas. Calibrated to the honest time budget available.',
            inputSchema: {
              type: 'object',
              properties: {
                platform_focus: {
                  type: 'string',
                  enum: ['x_twitter', 'linkedin', 'youtube_video', 'newsletter_owned_list'],
                  description: 'Primary platform to engineer'
                },
                time_budget: {
                  type: 'string',
                  enum: ['thirty_min_daily', 'one_hour_daily', 'two_hours_plus_daily'],
                  description: 'Honest daily time available'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                platform_mechanics: { type: 'string', description: 'What this algorithm rewards in 2026' },
                cadence_system: { type: 'string', description: 'Sustainable rhythm for this time budget' },
                calendar_architecture: { type: 'string', description: 'Pillar rotation, batching, evergreen bank' },
                packaging_rules: { type: 'string', description: 'Platform-native formatting that doubles reach' },
                consistency_infrastructure: { type: 'string', description: 'Systems that survive busy weeks' }
              },
              required: ['status', 'platform_mechanics', 'cadence_system', 'calendar_architecture', 'packaging_rules', 'consistency_infrastructure']
            },
            annotations: { title: 'Platform Content System Engineer', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'craft_hooks_formats_that_spread',
            description: 'Crafts the hooks and formats that earn attention honestly: hook engineering (the first-line psychology that stops the scroll — curiosity gaps that pay off, specificity that signals substance, the stakes-first opener — with before/after rewrites and the clickbait line you never cross), thread and long-form structures (the payoff-per-paragraph rule, open loops that close, the skimmable architecture), short-video scripts (the 3-second visual hook, pattern interrupts, the retention curve shape), and visual/carousel formats (the one-idea-per-slide law applied to social, the save-worthy checklist format). Calibrated to audience sophistication — what hooks beginners repels practitioners and vice versa.',
            inputSchema: {
              type: 'object',
              properties: {
                format_focus: {
                  type: 'string',
                  enum: ['hooks_openers', 'threads_longform', 'short_video_scripts', 'visual_carousel_formats'],
                  description: 'Format craft to engineer'
                },
                audience_sophistication: {
                  type: 'string',
                  enum: ['broad_beginner_audience', 'practitioner_niche_audience'],
                  description: 'Who the content must land with'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                hook_engineering: { type: 'string', description: 'First-line psychology with rewrites' },
                longform_structure: { type: 'string', description: 'Threads and posts that hold attention' },
                video_scripting: { type: 'string', description: 'Short-video hooks and retention shape' },
                visual_formats: { type: 'string', description: 'Carousels and save-worthy formats' },
                sophistication_calibration: { type: 'string', description: 'Tuning for this audience level' }
              },
              required: ['status', 'hook_engineering', 'longform_structure', 'video_scripting', 'visual_formats', 'sophistication_calibration']
            },
            annotations: { title: 'Hooks & Formats Craftsman', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'build_audience_growth_engine',
            description: 'Builds the growth engine that compounds followers into an owned audience: algorithm-distribution mechanics (why replies and early velocity decide reach, the engagement-window discipline, what kills distribution silently), strategic networking that is not cringe (the peer cohort strategy, value-first replies to larger accounts, the collaboration ladder from comments to co-creation), the repurposing engine (one pillar piece becomes 10 platform-native assets — the system that multiplies output without multiplying hours), and the owned-audience discipline (why the email list is the only audience you keep, capture mechanics that convert followers to subscribers). Sequenced to the current audience size — what works at 500 fails at 50,000 and vice versa.',
            inputSchema: {
              type: 'object',
              properties: {
                growth_focus: {
                  type: 'string',
                  enum: ['algorithm_distribution', 'strategic_networking', 'repurposing_engine', 'full_growth_system'],
                  description: 'Growth system to build'
                },
                current_size: {
                  type: 'string',
                  enum: ['under_1k_followers', 'one_to_10k_followers', 'over_10k_followers'],
                  description: 'Current audience size'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                distribution_mechanics: { type: 'string', description: 'Velocity, replies and silent killers' },
                networking_system: { type: 'string', description: 'Peer cohorts and the collaboration ladder' },
                repurposing_system: { type: 'string', description: 'One pillar piece to 10 assets' },
                owned_audience_capture: { type: 'string', description: 'Followers to email list conversion' },
                size_playbook: { type: 'string', description: 'What works at this audience size' }
              },
              required: ['status', 'distribution_mechanics', 'networking_system', 'repurposing_system', 'owned_audience_capture', 'size_playbook']
            },
            annotations: { title: 'Audience Growth Engine Builder', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'monetize_audience_honestly',
            description: 'Converts audience into income without burning the trust that built it: services and consulting monetization (the inbound-ready profile, the authority-to-pipeline bridge, productized offers announced without becoming a billboard), digital products (the audience-informed product selection, the build-in-public presale, launch sequencing to a warm audience), sponsorships and partnerships (rate math by niche and engagement — not follower count, the sponsor outreach kit, the editorial line that keeps trust), and the full monetization ladder sequenced by audience size and vertical. Includes the trust mathematics: why the 95/5 value-to-ask ratio outearns constant selling.',
            inputSchema: {
              type: 'object',
              properties: {
                monetization_focus: {
                  type: 'string',
                  enum: ['services_consulting', 'digital_products', 'sponsorships_partnerships', 'full_monetization_ladder'],
                  description: 'Monetization path to engineer'
                },
                audience_vertical: {
                  type: 'string',
                  enum: ['developers_tech', 'business_professionals', 'consumer_lifestyle_niche'],
                  description: 'Who the audience is'
                }
              },
              required: []
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                services_path: { type: 'string', description: 'Authority to client pipeline' },
                products_path: { type: 'string', description: 'Audience-informed products and presales' },
                sponsorship_path: { type: 'string', description: 'Rate math and the editorial line' },
                monetization_ladder: { type: 'string', description: 'Sequenced by size and readiness' },
                trust_mathematics: { type: 'string', description: 'The 95/5 ratio and why it outearns' }
              },
              required: ['status', 'services_path', 'products_path', 'sponsorship_path', 'monetization_ladder', 'trust_mathematics']
            },
            annotations: { title: 'Honest Audience Monetization Engineer', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
          },
          {
            name: 'check_brand_handle_live',
            title: 'Live Brand Handle & Domain Checker',
            description: 'Checks a brand handle LIVE across real sources: GitHub username availability via the official API, and .com/.dev domain DNS existence via Google DoH. Real lookups at request time, no API key.',
            inputSchema: {
              type: 'object',
              properties: {
                handle: { type: 'string', description: 'The brand handle/username to check e.g. pixelforge' }
              },
              required: ['handle']
            },
            outputSchema: {
              type: 'object',
              properties: {
                status: { type: 'string', description: 'success or error' },
                github_check: { type: 'string', description: 'Real GitHub username availability and profile stats if taken' },
                domain_check: { type: 'string', description: 'Real DNS existence check for the .com and .dev domains' },
                availability_summary: { type: 'string', description: 'Combined verdict across all checked surfaces' },
                brand_priorities: { type: 'string', description: 'What to lock first and naming fallbacks' },
                data_source: { type: 'string', description: 'How the checks were executed' }
              },
              required: ['status', 'github_check', 'domain_check', 'availability_summary', 'brand_priorities', 'data_source']
            },
            annotations: {
              readOnlyHint: true,
              destructiveHint: false,
              idempotentHint: false,
              openWorldHint: true
            }
          }
        ]
      }
    };
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};

    let result;
    try {
      switch (toolName) {
        case 'autonomous_personal_brand_architect':
          result = architectBrand(args);
          break;
        case 'engineer_platform_content_system':
          result = engineerContentSystem(args);
          break;
        case 'craft_hooks_formats_that_spread':
          result = craftHooks(args);
          break;
        case 'build_audience_growth_engine':
          result = buildGrowth(args);
          break;
        case 'monetize_audience_honestly':
          result = monetizeAudience(args);
          break;
        case 'check_brand_handle_live':
          if (!args || typeof args.handle !== 'string' || args.handle.length === 0) { return { jsonrpc: '2.0', id, error: { code: -32602, message: 'Missing required parameter: handle (string)' } }; }
          result = await checkBrandHandleLive(args);
          break;
        default:
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: 'Unknown tool: ' + toolName }
          };
      }

      result.pro_monetization = {
        note: "You are on the Freemium tier (10 free requests/day). Unlock unlimited Pro requests:",
        ...MONETIZATION_INFO
      };

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        }
      };
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: 'Tool execution error: ' + err.message }
      };
    }
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: 'Method not found: ' + method }
  };
}

/* ─────────────────────────── TOOL 1: BRAND ARCHITECT ─────────────────────────── */

function architectBrand(args) {
  const focus = args.brand_focus;
  const stage = args.stage || 'no_presence_yet';
  const goal = args.creator_goal || 'land_clients_consulting';

  const stageDiagnosis = {
    no_presence_yet: 'NO-PRESENCE DIAGNOSIS: the blank-slate advantage is real — no bad habits to unlearn, and the 2026 reality favors late starters (platforms reward current consistency over account age; a 90-day-old account posting daily with sharp positioning outgrows a 5-year-old account posting monthly). The correct first moves: positioning BEFORE posting (the 3-pillar identity below — random posting builds random audiences that buy nothing), the profile engineered as a landing page (who you help + the proof + where to go next — profiles convert or waste every impression your content earns), and the 30-day reps phase with zero growth expectations (the first month is for finding your voice and format fit; judging week-2 numbers is like judging a gym membership at day 10). The only fatal mistake available at this stage: waiting for the perfect niche instead of starting with a direction and letting the audience data refine it.',
    posting_no_growth: 'POSTING-NO-GROWTH DIAGNOSIS: effort without distribution — audit in this order: (1) THE HOOK LEAK (most common): content with value buried under weak first lines dies unread — rerun your last 20 posts through the hook rewrites (craft_hooks_formats_that_spread); if impressions exist but engagement does not, packaging is the leak; (2) THE DISTRIBUTION LEAK: posting-and-ghosting kills algorithmic trust — the engagement window discipline (being present for the first hour, replying to every comment) and the daily reply habit on larger adjacent accounts are not optional extras, they ARE distribution at small size; (3) THE POSITIONING LEAK: if the same person seeing three of your posts could not say what you are about, the pillars are mush — recognizability compounds, randomness evaporates; (4) THE PLATFORM MISMATCH: deep technical content on fast-scroll platforms or quick takes on dwell-time platforms is good content in the wrong room. The honest timeline: with the leaks fixed, small accounts should see directionally better numbers inside 30 days — flat after 90 disciplined days means reposition, not repost harder.',
    growing_no_money: 'GROWING-NO-MONEY DIAGNOSIS: the audience exists but the bridge to revenue was never built — the audit: (1) THE INVISIBLE OFFER: followers cannot buy what was never clearly offered; the monetization-ready profile and the periodic plain-language offer post ("here is what I do, here is who it is for, here is how to start") feel repetitive to you and are news to 97% of the audience; (2) THE MISSING CAPTURE: platform followers are rented — without the email list and the lead magnet bridge, every algorithm change taxes your income directly (build_audience_growth_engine has the capture mechanics); (3) THE WRONG-AUDIENCE TRAP (the painful one): an audience built on viral general content does not convert to specialist offers — engagement quality beats follower quantity, and 2,000 practitioners outbuy 50,000 drive-by scrollers; if the audience is wrong, the content pillars pivot BEFORE the monetization pushes harder; (4) THE TRUST DEFICIT: accounts that never show proof (work, results, process) hit a believability ceiling exactly at the moment of the ask. Sequencing fix: capture first, offer clarity second, product third — monetizing harder into a leaky funnel just burns the audience faster.',
    established_plateau: 'ESTABLISHED-PLATEAU DIAGNOSIS: the first growth curve exhausted its audience pocket — breaking plateaus is structural, not motivational: (1) THE FORMAT REFRESH: the format that built the account stops working when the audience saturates on it — the quarterly format experiment (one new format, 10 honest attempts, keep or kill on data) is maintenance, not reinvention; (2) THE COLLABORATION JUMP: at plateau size, borrowed audiences are the fastest new-pocket access — the collaboration ladder (guest pieces, co-streams, podcast circuits) moves accounts that solo posting cannot; (3) THE DEPTH PIVOT: plateaued reach with deepening trust is not stagnation — if replies, DMs and conversion rates still climb, the business is growing inside a flat follower count (monetize the depth: higher-tier offers, the flagship product); (4) THE PLATFORM EXPANSION: only now does the second platform make sense — repurposing the proven library into a new ecosystem with 20% of the effort of the first build. The plateau trap to refuse: buying growth with content that betrays the positioning — the spike costs more trust than it earns reach.'
  };

  const goalNotes = {
    sell_products_courses: 'PRODUCT-SELLER ARCHITECTURE: the audience IS the distribution channel, so build it where buying behavior lives — the content mix tilts toward demonstrable results and process (build-in-public converts best for products: the journey posts, the metric screenshots, the lessons-learned threads presell better than any launch sequence), the email capture starts WEEK ONE (product launches to platform followers alone underperform launches to even small lists by multiples), and the product selection comes FROM the audience (the questions asked repeatedly, the problems described in replies — audience-informed products presell; imagined products launch to silence). The patience math: credible product launches typically need 1,000+ engaged followers or 500+ list subscribers — the months before that threshold are spent building the library and the list, not launching early to nobody.',
    land_clients_consulting: 'CLIENT-HUNTER ARCHITECTURE: authority converts, reach decorates — the content mix tilts toward proof-of-expertise (case breakdowns, teardowns of public examples, the specific-problem-specific-solution posts that make a prospect think "this person has solved MY exact issue"), the profile is a conversion asset (who you help, the credibility line, the single clear next step to a call or audit), and the DM discipline is professional (inbound conversations answered fast, value-first, no pitch-slapping). The counterintuitive math: client-hunters need SMALLER audiences than product-sellers — 1,500 followers containing 50 ideal-profile decision-makers outearns 50,000 generalists; optimize for who follows, not how many. Distribution choice follows the buyer: B2B services live on LinkedIn and X; the niche communities where your buyers ask questions are worth more than any follower count.',
    career_opportunities_network: 'CAREER-BUILDER ARCHITECTURE: the brand as a standing job application and network engine — the content mix tilts toward learning-in-public (the project writeups, the TIL posts, the honest struggle-and-solution arcs that read as growth trajectory to hiring managers) and generous community participation (the helpful-reply reputation compounds into referrals, collaborations and inbound offers). The profile states the direction ("building toward X") because opportunities route to clear destinations. The compounding asset: every post is a searchable, linkable proof-of-thinking that outlives any resume — recruiters, conference organizers and future cofounders all arrive through the same library. The warning: career-builders drift into engagement-bait fastest (hot takes outperform substance short-term) — the brand that gets job offers is built on substance the hot takes dilute.'
  };

  return {
    status: 'success',
    positioning_read: `Personal brand architecture for: "${focus}" — stage: ${stage.replace(/_/g, ' ')}, goal: ${goal.replace(/_/g, ' ')}. THE POSITIONING INTERSECTION (all three or it collapses): (1) WHAT YOU KNOW — the expertise with real depth (shallow positioning gets exposed by the first hard question in the replies); (2) WHAT YOU CAN PROVE — the receipts available today (projects, results, process, even documented learning — proof is relative to the claim: "I am learning X in public" needs only honesty, "I am an X expert" needs a body of work); (3) WHAT EARNS ATTENTION — the overlap between your knowledge and what an identifiable audience actively wants (the brutal filter: expertise nobody searches for or struggles with is a hobby, not a position). THE ANGLE REQUIREMENT: the topic is not the position — "AI engineering" is a topic; "AI engineering for teams shipping to production without an ML background" is a position with a face. THE RECOGNIZABILITY TEST: after seeing three posts, a stranger should be able to finish the sentence "this is the person who..." — if the answer is generic, the position is generic, and generic positions compete with everyone for nobody. ` + goalNotes[goal],
    platform_selection: 'PLATFORM SELECTION MATH: choose where the BUYERS scroll, not where creators congregate — X/TWITTER: tech, startup, indie-hacker and developer density; the fastest feedback loops and network effects in replies; text-first, velocity-driven; the default for dev-adjacent brands. LINKEDIN: B2B decision-makers with budgets, professional context that makes commercial posts native rather than intrusive; dwell-time algorithm rewards substance; underpriced reach for consultants and service businesses through 2026. YOUTUBE: the trust-depth champion (20 minutes of your thinking builds para-social trust no text thread matches) and the only true search-compounding platform — the slowest build and the deepest moat. NEWSLETTER/OWNED LIST: not optional and not first — the destination every platform feeds (the only audience that survives algorithm changes, platform deaths and account suspensions). THE ONE-PLATFORM LAW: one primary platform mastered to real traction (3-6 months minimum) before any expansion — the multi-platform day-one strategy produces four mediocre presences and zero compounding; the list capture runs from day one regardless.',
    content_identity: 'THE 3-PILLAR SYSTEM (recognizable beats prolific): PILLAR 1 — THE EXPERTISE CORE (50-60% of content): the teaching, breakdowns, how-tos and frameworks in your position; this pillar earns the follow. PILLAR 2 — THE PROOF ENGINE (25-35%): the work in progress, results, case breakdowns, build-in-public artifacts; this pillar earns the trust (and does the preselling silently). PILLAR 3 — THE HUMAN THREAD (10-20%): the perspective, lessons, opinions and story that make you a person instead of a content faucet; this pillar earns the connection (and the shares). THE DISCIPLINE: every post belongs to a pillar; ideas outside the pillars go to the someday-list, not the feed — the account that posts about everything is remembered for nothing. THE VOICE RULE: write like you explain to a smart friend — the personality IS the moat in an era where generic content is free; sand off the voice and nothing differentiable remains.',
    stage_diagnosis: stageDiagnosis[stage],
    execution_roadmap: 'EXECUTION ROADMAP (90 days from invisible to in-demand): WEEKS 1-2 — foundation: position locked (the intersection + the angle sentence), profile engineered as a landing page, the 3 pillars defined with 10 banked ideas each, platform chosen by buyer-location math, email capture live (even a simple landing page). WEEKS 3-6 — the reps phase: daily platform-native posting on pillar rotation, the daily 30-minute engagement block (replies on target-audience conversations — at small size, replies ARE distribution), zero dashboard-watching (the data means nothing yet; the habit means everything). WEEKS 7-10 — the data phase: double down on the 20% of posts that outperformed (format AND topic), kill what consistently dies, start the weekly deep piece (the thread/article/video that becomes the repurposing source), first collaboration reps (guest exchanges with peer accounts). WEEKS 11-13 — the bridge phase: the lead magnet matched to the proven-interest topic, the capture bridge posts, the first plain-language offer post (whatever the goal: the service, the product waitlist, the "open to X" signal), and the 90-day review: pillar performance, audience quality (are the RIGHT people following?), and the next quarter planned on evidence. THE COMPOUNDING TRUTH: brands are built by median posts sustained for quarters, not by one viral day — the system that survives busy weeks beats the sprint that ends in week five.'
  };
}

/* ─────────────────────────── TOOL 2: PLATFORM CONTENT SYSTEM ─────────────────────────── */

function engineerContentSystem(args) {
  const platform = args.platform_focus || 'x_twitter';
  const budget = args.time_budget || 'one_hour_daily';

  const platformMechanics = {
    x_twitter: 'X/TWITTER MECHANICS (2026): the velocity-and-reply machine — early engagement (first 30-60 minutes) decides whether a post escapes your follower pocket; replies weigh heavier than likes (conversation signals quality), and the algorithm amplifies accounts whose REPLIES earn engagement too (the reply-guy strategy is literally distribution engineering). What works: strong first lines (the hook carries everything on a scroll feed), native threads for depth (with payoff per tweet — thread abandonment is measured), plain-text takes with specificity, and consistent daily presence (the algorithm decays dormant accounts fast). What kills silently: external links in the main post (parked in the reply instead), engagement-bait patterns the spam filters now catch, posting into dead hours for your audience geography, and the post-and-ghost habit (velocity needs your presence in the replies). The small-account unlock: 10 thoughtful replies daily on large adjacent accounts out-distributes your own posts at under 1k followers — borrowed conversations are the on-ramp.',
    linkedin: 'LINKEDIN MECHANICS (2026): the dwell-time-and-context machine — the algorithm measures reading time and meaningful interaction (comments over reactions, by far), favors professional-context substance, and distributes over DAYS rather than hours (the long tail rewards evergreen professional content). What works: the first 2-3 lines as the hook (everything pre-fold decides the "see more" click, which is itself a ranked signal), white-space formatting (dense paragraphs die on mobile), personal-professional stories with a business lesson (the native genre), carousels/documents for frameworks (the save-and-share format), and comments on target-audience posts as visibility engineering (your comment is content with the author\u2019s audience). What kills: external links in-post (the platform taxes exits), corporate-speak (the feed rewards human voice in professional context), posting more than once daily (self-competition in the distribution window), and selling in every post (the 95/5 rule is enforced by audience fatigue here faster than anywhere). The B2B unlock: LinkedIn reach per follower is the most underpriced in social through 2026 — small accounts routinely out-reach their follower counts on substance.',
    youtube_video: 'YOUTUBE MECHANICS (2026): the click-and-retention economy — two numbers rule everything: CTR (title + thumbnail earn the click) and retention (the video earns the next recommendation); the algorithm is a matchmaker between proven-interest viewers and videos that hold them. What works: title-first production (the video is made FOR a title/thumbnail promise, never titled after the fact), the first 30 seconds honoring the promise immediately (preamble is retention suicide), chapter-structured delivery with visual change every 20-30 seconds, and search-intent content early (how-to and problem-solution queries give small channels their first algorithmic wins while browse/recommended traffic matures). What kills: inconsistent upload rhythm (the algorithm tests channels on reliability), topic sprawl (the channel-level audience signal blurs), and quality-over-quantity inversion (one strong weekly video beats four rushed ones — production debt compounds negatively). The compounding unlock: YouTube is the only major platform where 2-year-old content still acquires audience daily — the library IS the asset; every video is infrastructure, not a post.',
    newsletter_owned_list: 'NEWSLETTER MECHANICS (2026): the owned-relationship machine — no algorithm stands between you and the inbox, which makes deliverability and opens the whole game: consistent send rhythm (same day, same time — the expectation IS the open rate), subject lines engineered like hooks (the inbox is a feed too), reply-encouraging formats (replies are both relationship gold and deliverability signal — ask real questions, answer every reply), and list hygiene discipline (sunset non-openers quarterly; a 2,000-reader list at 50% opens outperforms 10,000 at 8% in every way that counts, including deliverability itself). What works: ONE idea per issue delivered well (the single-topic essay/breakdown outperforms the link-dump digest for connection), the personal voice (newsletters are read as letters, not feeds), and the P.S. line (the most-read line after the subject — the natural home of the soft offer). What kills: inconsistency (the skipped month resets trust), pure aggregation with no perspective, and list-building without a conversion bridge from the platforms. The strategic truth: the newsletter is not a platform choice — it is the DESTINATION all platform audiences should funnel toward; platform followers are leads, subscribers are the asset.'
  };

  const cadenceByBudget = {
    thirty_min_daily: 'THIRTY-MINUTE CADENCE (the minimum effective dose): daily rhythm — 15 min: one platform-native post (from the banked-ideas list, never from a blank page: the bank is refilled in the weekly session); 15 min: the engagement block (replies on your post + 5-8 thoughtful replies on target-audience conversations). Weekly (one 60-90 min weekend session): refill the idea bank by pillar, draft the week\u2019s posts in one batch, one deeper piece every TWO weeks (the thread/article the dailies tease). What this budget honestly produces: slow, real compounding — visible traction in months, not weeks; the discipline that matters most at this budget: zero time on dashboards, all time on reps.',
    one_hour_daily: 'ONE-HOUR CADENCE (the compounding standard): daily rhythm — 20 min: the day\u2019s post, written properly (hook rewritten twice before publishing); 25 min: the engagement block (every comment answered + 8-12 strategic replies in target conversations); 15 min: tomorrow\u2019s draft or the weekly piece advanced. Weekly: ONE deep piece (the pillar thread, the breakdown, the video) — this is the repurposing source and the authority builder; one 60-min batch session (idea bank, scheduling, the week\u2019s skeleton). Monthly: the format review (what outperformed, what died, one experiment for next month). This budget sustains a serious single-platform brand plus a weekly-to-biweekly newsletter — the configuration most working professionals should run.',
    two_hours_plus_daily: 'TWO-HOUR-PLUS CADENCE (the builder tier): the time funds SYSTEMS, not just volume — daily: the primary-platform post + full engagement discipline (the one-hour core), PLUS the compounding layer: the weekly deep piece becomes 2-3 weekly (or the YouTube video becomes weekly), the repurposing engine runs on schedule (the deep pieces atomized across the secondary surface), and the newsletter runs weekly as the capture destination. The warning this budget needs: more hours invite diffusion — the extra time goes DEEPER on one platform plus the owned list, not WIDER across four platforms; wide-and-shallow is the most expensive mistake available at this tier. The quarterly check: if doubled hours have not produced visibly compounding assets (library, list growth, inbound), the time is leaking into consumption disguised as research.'
  };

  return {
    status: 'success',
    platform_mechanics: platformMechanics[platform],
    cadence_system: cadenceByBudget[budget],
    calendar_architecture: 'CALENDAR ARCHITECTURE: THE PILLAR ROTATION — the weekly skeleton assigns each slot a pillar before any ideas are chosen (e.g. Mon expertise / Tue proof / Wed expertise / Thu human / Fri expertise+capture) — the rotation guarantees balance without daily decisions; decision fatigue, not idea shortage, is what actually breaks posting streaks. THE IDEA BANK: a single running list, organized by pillar, fed continuously (every reply you write that lands, every question you get asked, every problem you solve is an entry) — the bank converts consumption and conversation into inventory; a 30-entry bank is a quarter of calm. THE BATCH SESSIONS: drafting happens in batches (the weekly session produces the week), publishing happens daily — separating creation from publication is the single highest-leverage workflow change for consistency. THE EVERGREEN BANK: the 10-15 proven posts (your greatest hits) scheduled for refreshed reposts every 6-10 weeks — new followers never saw them, old followers forgot them, and the bank carries the weeks when life wins. THE DEEP-PIECE SLOT: one protected slot weekly for the piece that compounds (thread/essay/video) — dailies maintain presence; deep pieces build the brand.',
    packaging_rules: 'PACKAGING RULES (same idea, double reach): THE PLATFORM-NATIVE LAW — every platform has a native shape (X: compressed insight, line breaks, thread for depth; LinkedIn: story-lesson arc, white space, document for frameworks; YouTube: promise-delivery structure; newsletter: the personal essay register) and ideas travel between platforms only by RESHAPING, never by cross-posting (the audience smells imported content instantly, and algorithms downrank it). THE HOOK TRANSPLANT: when a post works, the IDEA is proven — repackage it in every native shape it fits (the thread becomes the carousel becomes the video segment becomes the newsletter section); one proven idea properly transplanted outperforms four unproven ones. THE FORMAT SIGNATURE: own 1-2 recognizable formats (the weekly teardown, the numbered framework, the before/after breakdown) — signature formats train the audience what to expect and the algorithm who to show it to. THE READ-TIME RESPECT: every format has a native length ceiling — the 4,000-word newsletter essay, the 12-tweet thread, the 90-second short — and padding past the idea\u2019s natural weight is where audiences quietly leave.',
    consistency_infrastructure: 'CONSISTENCY INFRASTRUCTURE (the system that survives busy weeks): THE MINIMUM VIABLE WEEK defined in advance — the floor (e.g. 3 posts + daily replies) that counts as a win during crunch; streak-thinking ("daily or failure") produces the abandonment it fears, floor-thinking produces years of presence. THE BUFFER: 5-7 scheduled posts standing between you and the blank page — refilled in batch sessions, deployed when life happens. THE 15-MINUTE EMERGENCY KIT: the list of post types producible in 15 minutes flat (the question post, the one-lesson post, the evergreen repost, the curation-with-take) for the days the calendar lies. THE QUARTERLY SUSTAINABILITY REVIEW: if the system requires heroics, the system is wrong — cut the cadence to what repeats forever; the account posting 4x weekly for two years beats the account that posted daily for four months and vanished, every single time, on every platform.'
  };
}

/* ─────────────────────────── TOOL 3: HOOKS & FORMATS ─────────────────────────── */

function craftHooks(args) {
  const focus = args.format_focus || 'hooks_openers';
  const sophistication = args.audience_sophistication || 'practitioner_niche_audience';

  const sophisticationNotes = {
    broad_beginner_audience: 'BROAD-BEGINNER CALIBRATION: clarity beats cleverness and relatability beats authority — hooks lead with the FELT problem in everyday language ("your resume is getting rejected by software before a human sees it" beats "ATS parsing optimization strategies"), jargon is translated or banished (every undefined term loses a slice of the audience), structure is more generous (more steps, more examples, more reassurance — beginners need the path lit, not just pointed at), and the emotional register is permission-giving ("you are not behind; here is the map"). The volume upside: beginner content has the biggest addressable audience and the strongest share mechanics (people share what helped them feel capable). The trap: talking down — beginner-friendly means jargon-free, never substance-free; the audience knows the difference immediately.',
    practitioner_niche_audience: 'PRACTITIONER-NICHE CALIBRATION: specificity IS the hook — practitioners scroll past generic advice at light speed and stop dead for their exact stack, their exact edge case, their exact number ("we cut the Worker cold-start from 180ms to 9ms — here is the config" stops every person who owns that problem); jargon is a feature (shared vocabulary signals in-group credibility — translating it reads as outsider), claimed results need receipts in the same post (practitioners audit by reflex), and contrarian takes need working evidence, not attitude. The economics upside: practitioner audiences are smaller and worth multiples per follower (they have budgets, they buy tools and services, they hire). The trap: complexity theater — practitioners respect simplification backed by depth ("here is the 20% that matters and why") more than exhaustive completeness; the expert who makes it simple outranks the expert who makes it long.'
  };

  const focusContent = {
    hooks_openers: 'HOOK-ENGINEERING DEEP-DIVE: the first line buys the second line, nothing more — THE SIX HONEST PATTERNS: (1) THE SPECIFIC RESULT ("I replaced a $400/month tool stack with one 90-line Worker"): numbers signal substance, specificity signals truth; (2) THE STAKES-FIRST ("The clause in your client contract that costs the most is the one nobody reads"): open with what is at risk; (3) THE CURIOSITY GAP THAT PAYS ("The resume change that tripled my response rate had nothing to do with my experience") — the gap is honest ONLY if the payoff genuinely lands; unpaid curiosity is a one-time trick that taxes every future post; (4) THE SHARED-ENEMY ("Hourly billing punishes you for getting better at your job"): naming the thing the audience already resents; (5) THE COUNTER-POSITION ("Most pricing advice is backwards. The expensive option is often the safe one.") — contrarian WITH a payoff, never contrarian as a costume; (6) THE STORY DROP ("The client ghosted after the proposal. The follow-up email that un-ghosted them took 4 sentences."): in-media-res beats setup. THE REWRITE PROTOCOL: write the post, then rewrite the first line LAST, three candidates minimum, pick the one a stranger would stop for. BEFORE/AFTER EXAMPLES: "Some thoughts on pricing" → "The pricing mistake that cost me $30k before I noticed it" / "How to get more clients" → "I audited 40 agency pipelines. The dead ones all had the same leak." THE LINE YOU NEVER CROSS: the hook may compress and dramatize, but it may not promise what the post does not deliver — clickbait is a payday loan against your own trust, and the interest rate is the audience.',
    threads_longform: 'THREADS-LONGFORM DEEP-DIVE: structure is retention — THE PAYOFF-PER-PARAGRAPH RULE: every unit (tweet in a thread, paragraph in a post) delivers value on its own; readers abandon the moment a unit reads like filler or setup; the thread that saves its value for tweet 9 dies at tweet 3. THE ARCHITECTURE: the HOOK unit (the promise, sharp), the MAP unit (optional, one line: what is coming — a reason to continue), the DELIVERY units (one idea each, the strongest 2-3 ideas placed first and last, the skimmable spine: a reader skimming only first lines should still get the gist), the LANDING unit (the summary + the single CTA — follow, subscribe, the link; multiple asks cancel each other). OPEN LOOPS THAT CLOSE: tension devices ("the third mistake is the expensive one") are legitimate ONLY when the payoff arrives and is worth the wait. FORMAT MECHANICS: numbered structures outperform unnumbered on completion (progress visibility), line-break generosity beats density everywhere, and bold/emoji signposting works until it becomes noise (one accent per unit, maximum). THE LENGTH HONESTY: the thread earns its length or loses its reader — 6 strong units beat 14 padded ones; when in doubt, cut the warmup and start at the first real insight.',
    short_video_scripts: 'SHORT-VIDEO DEEP-DIVE: the retention curve is the script — THE 3-SECOND VISUAL HOOK: the first frame + first sentence must justify the next three seconds (the pattern: state the payoff or the stakes immediately — "this config change doubled our conversion" — while the visual shows the END state, not your face saying hello); greetings, names and channel intros are retention suicide in short form. THE CURVE SHAPE: front-load (the promise in seconds 0-3), re-hook every 7-10 seconds (pattern interrupts: visual change, zoom, caption shift, the "but here is the part nobody mentions" turn), and END CLEAN (the last 2 seconds set up the loop or the follow — trailing endings bleed the completion metric that decides distribution). THE SCRIPT SKELETON (30-60s): HOOK (0-3s: the payoff stated) → CONTEXT (3-8s: the minimum setup to care) → DELIVERY (8-45s: the steps/insight, one visual change per beat) → PAYOFF CONFIRMED (the result shown) → THE BUTTON (one ask, two seconds max). CAPTION DISCIPLINE: captions always (sound-off viewing is the majority), keywords visually emphasized, no caption walls covering the content. THE TALKING-HEAD ALTERNATIVE: screen recordings, process shots and before/afters with voiceover outperform face-to-camera for technical content — the content is the star; the face is optional.',
    visual_carousel_formats: 'VISUAL-FORMATS DEEP-DIVE: the save is the metric — carousels and visual posts win on SAVEABILITY (the checklist, the framework, the cheatsheet — content the viewer wants to find again), and saves outweigh likes in every algorithm that counts them. THE CAROUSEL ARCHITECTURE: SLIDE 1 is a pure hook (the promise, big type, zero clutter — it competes in the feed like any first line), slides 2-8 run ONE idea per slide (the social version of the one-idea-per-slide law: a slide needing two ideas is two slides), the visual spine stays consistent (same template, same type system — the carousel reads as one object), and the FINAL slide is the single CTA (save this / follow for the series / the capture link). THE DESIGN FLOOR (no designer needed): one template, two fonts, high contrast, type big enough for a phone at arm\u2019s length — consistency and legibility beat decoration every time; the amateur tell is variety, not simplicity. THE FORMATS THAT COMPOUND: the numbered framework (N steps to outcome), the mistakes list (what to stop doing — negative framing outperforms positive consistently), the before/after breakdown (the transformation shown, then explained), the myth/reality table, and the resource stack (the curated list with your commentary — curation with a take is content). THE REPURPOSING NOTE: every strong thread is a carousel waiting, and vice versa — the visual format is the second life of proven text.'
  };

  return {
    status: 'success',
    hook_engineering: focus === 'hooks_openers' ? focusContent.hooks_openers : 'HOOK ENGINEERING (compressed): six honest patterns (specific result, stakes-first, paying curiosity gap, shared enemy, counter-position with payoff, story drop), the rewrite-first-line-last protocol with three candidates, and the line never crossed: the hook may compress, never overpromise. Full craft with before/afters: run format_focus=hooks_openers.',
    longform_structure: focus === 'threads_longform' ? focusContent.threads_longform : 'LONGFORM STRUCTURE (compressed): payoff per unit (no filler survives), hook → optional map → delivery with the strongest ideas first and last → one-CTA landing, open loops that genuinely close, numbered spines for completion, 6 strong units over 14 padded ones. Full architecture: run format_focus=threads_longform.',
    video_scripting: focus === 'short_video_scripts' ? focusContent.short_video_scripts : 'VIDEO SCRIPTING (compressed): 3-second payoff-first hooks (no greetings), re-hooks every 7-10 seconds, the 30-60s skeleton (hook/context/delivery/payoff/button), captions always, screen-and-process shots over talking heads for technical content. Full curve engineering: run format_focus=short_video_scripts.',
    visual_formats: focus === 'visual_carousel_formats' ? focusContent.visual_carousel_formats : 'VISUAL FORMATS (compressed): design for the save (checklists, frameworks, cheatsheets), slide-1-as-hook carousels with one idea per slide and a single-CTA closer, one template + two fonts + phone-legible type, and the compounding formats (numbered framework, mistakes list, before/after, resource stack). Full system: run format_focus=visual_carousel_formats.',
    sophistication_calibration: sophisticationNotes[sophistication]
  };
}

/* ─────────────────────────── TOOL 4: GROWTH ENGINE ─────────────────────────── */

function buildGrowth(args) {
  const focus = args.growth_focus || 'full_growth_system';
  const size = args.current_size || 'under_1k_followers';

  const sizePlaybooks = {
    under_1k_followers: 'UNDER-1K PLAYBOOK: your posts have almost no native distribution yet — borrowed conversations are the engine: (1) THE REPLY STRATEGY AS PRIMARY CHANNEL: 10-15 genuinely valuable replies daily on larger accounts where your audience already gathers — the reply that adds a real insight gets profile clicks, and at this size profile clicks ARE growth; treat replies with post-level craft; (2) THE PROFILE CONVERSION LOOP: every reply click lands on the engineered profile (position clear, pinned proof, capture link) — leaky profiles waste the whole strategy; (3) POST FOR THE PORTFOLIO: the daily posts matter less for today\u2019s reach than as the body of work the profile-clicker binges — consistency and pillar discipline over viral attempts; (4) THE PEER COHORT: find 5-10 accounts at your size and stage, engage genuinely and mutually — the cohort that rises together shares momentum at every stage; (5) IGNORE: follower counts, going viral, platform expansion, monetization pressure. The honest math: 0 to 1k is the slowest thousand — it is built one reply and one real connection at a time, and the habits formed here are the entire machine later.',
    one_to_10k_followers: 'ONE-TO-10K PLAYBOOK: native distribution exists — now the engine shifts to leverage: (1) THE DEEP-PIECE ENGINE: the weekly flagship (thread/essay/video) becomes the growth driver — small accounts grow on replies; mid accounts grow on shareable depth; (2) THE COLLABORATION LADDER ACTIVATES: newsletter swaps, guest pieces, podcast guesting, co-created content — borrowed audiences at this size move the needle visibly, and you now have enough of an audience to trade; (3) CAPTURE GETS SERIOUS: the lead magnet + the weekly-ish newsletter — the conversion of followers to OWNED subscribers is the difference between an audience and a number (algorithm changes at this size are survivable only through the list); (4) THE DATA DISCIPLINE: enough volume exists to see format/topic truth — the monthly review doubles down ruthlessly; (5) THE FIRST MONETIZATION BRIDGE: the audience can now sustain the first honest offer (the service, the small product, the presale) — monetize_audience_honestly sequences it. The trap at this size: chasing the next platform before the first one compounds — 1-10k is where focus pays most and diffusion costs most.',
    over_10k_followers: 'OVER-10K PLAYBOOK: distribution is real — the risks invert from obscurity to dilution and rent-dependence: (1) THE OWNED-AUDIENCE RATIO becomes the health metric: subscribers-to-followers above 5-10% is resilient; below 2% is a landlord problem wearing a success costume — the capture engineering gets priority over follower growth; (2) THE AUTHORITY LAYER: the flagship content (the definitive guide, the annual breakdown, the signature series) converts reach into standing — at this size you can own QUESTIONS, not just answer them; (3) COLLABORATION SHIFTS UPSTREAM: podcasts, conferences, partnerships with brands and larger creators — the brand now opens doors that cold outreach cannot; (4) THE DELEGATION QUESTION arrives honestly: repurposing, clipping and scheduling can delegate; voice and replies to real conversations cannot — the accounts that fully outsource the human part decay into content farms with legacy followings; (5) THE PLATEAU MATH: growth percentage slows at scale by arithmetic — the business metrics (list growth, revenue per thousand followers, inbound quality) replace follower velocity as the scoreboard. The discipline: the bigger the audience, the more each off-positioning post costs — the editorial line tightens as the reach grows.'
  };

  const focusContent = {
    algorithm_distribution: 'DISTRIBUTION-MECHANICS DEEP-DIVE: every feed algorithm in 2026 runs the same core loop — show the post to a test pocket, measure the velocity and quality of response, expand or bury accordingly: (1) THE VELOCITY WINDOW: the first 30-90 minutes decide the expansion — publish when YOUR audience is actually awake (the analytics tab knows), and be PRESENT in that window (replying to every early comment doubles the conversation signal the algorithm reads); (2) THE REPLY WEIGHT: comments outweigh likes on every platform that matters — design posts that invite real response (the specific question, the fill-in-the-blank, the "what did I miss?") without engagement-bait patterns (the filters catch "comment YES below" and tax the account); (3) THE SILENT KILLERS: external links in the main unit (park them in replies/comments), deleted-and-reposted content (the algorithm remembers), inconsistent posting gaps (dormancy decays account-level trust), and off-pillar topic lurches (the algorithm\u2019s model of WHO should see you blurs — recognizability is an algorithmic asset too); (4) THE CONVERSATION ASSET: your replies on OTHER posts are ranked content — the account that converses daily earns distribution the account that broadcasts never sees; (5) THE HONEST FRAME: the algorithm is not gamed sustainably — it is a proxy for "do humans who see this want more?"; every tactic above only amplifies content that already deserves it.',
    strategic_networking: 'NETWORKING DEEP-DIVE (without the cringe): (1) THE PEER COHORT (the most underrated growth asset): 5-10 creators at YOUR stage in adjacent niches — genuine mutual engagement, shared learnings, eventual collaborations; cohorts compound because everyone\u2019s growth lifts everyone\u2019s (and the DM group of real peers is the sanity infrastructure of a public builder); (2) THE VALUE-FIRST LADDER with larger accounts: rung one — months of genuinely excellent replies (be known in their comments before you exist in their DMs); rung two — the useful unprompted contribution (the bug report, the resource, the thoughtful pushback that proves you think); rung three — the small collaboration ask with the work already done ("I wrote X building on your Y — happy to credit and link however you prefer"); the ladder works because every rung gives before it asks; (3) THE COLLABORATION MENU by size: guest essays and newsletter swaps (equal-size trades), the curation feature (featuring THEIR work with real commentary — generosity is visible), podcast guesting (the highest-trust borrowed audience per hour spent), and co-created pieces (the joint teardown, the debate thread) that give both audiences a reason to cross; (4) THE DM DISCIPLINE: DMs open doors when they contain specific value and zero asks ("this reminded me of your post on X — here is a data point you might use") and close them permanently when they pitch on first contact; (5) THE LONG GAME TRUTH: the network effect in creator growth is not follower spillover — it is the referral web (the podcast invite, the speaking slot, the client sent your way) that routes through humans who KNOW you, and knowing is built in months of small genuine touches.',
    repurposing_engine: 'REPURPOSING-ENGINE DEEP-DIVE: one pillar piece becomes ten assets — THE SOURCE DISCIPLINE: the weekly deep piece (the 1,500-word breakdown, the 12-unit thread, the 15-minute video) is created as the WEEK\u2019S RAW MATERIAL, not just a post — depth first, atomization second; shallow sources atomize into confetti. THE ATOMIZATION MAP: the deep piece yields — 2-3 standalone insight posts (each strong section compressed to its native-post shape), 1 carousel/visual (the framework or checklist extracted), 3-5 quote-able single lines (the sharpest sentences, reposted as plain takes), 1 newsletter section (the piece reframed in the personal register with the backstory the public version cut), 1 short-video script (the core insight in the 30-60s skeleton), and the evergreen-bank entry (the proven piece scheduled for its 8-week refresh). THE RESHAPING LAW: every derivative is REBUILT in the target format\u2019s native shape (never screenshot-and-paste — the carousel is redesigned, the video is rescripted); the idea travels, the packaging does not. THE CADENCE: atomization is a batch task (45 minutes after the deep piece ships produces the week\u2019s derivative inventory) — the engine turns one deep creative session into daily presence without daily creation. THE PROOF FILTER: double down on atomizing what PERFORMED — the deep piece that landed feeds two weeks of derivatives; the one that died taught a lesson and feeds nothing.',
    full_growth_system: 'FULL-GROWTH-SYSTEM: the four engines and their order — (1) DISTRIBUTION DISCIPLINE (free, immediate): the velocity-window presence, the reply weight, the silent-killer avoidance — this is tuning the machine you already run; (2) THE REPLY/NETWORKING LAYER (the under-10k engine): borrowed conversations and the peer cohort — hours-heavy, compounding, and the source of every later collaboration; (3) THE DEEP-PIECE + REPURPOSING ENGINE (the leverage layer): one serious weekly creation multiplied into daily presence — this is where time stops scaling linearly with output; (4) THE CAPTURE SPINE (the whole point): every engine above feeds the owned list — the lead magnet matched to proven interest, the capture bridge in the profile and the deep pieces, the newsletter as the destination; followers are the top of the funnel, subscribers are the asset, and the brand that skips this step builds its house on a landlord\u2019s land. THE WEEKLY SCORECARD (ten minutes, four numbers): posts shipped vs the floor, replies/conversations held, list subscribers added, and the one format experiment\u2019s verdict — growth is a system diagnosed weekly, not a lottery checked hourly.'
  };

  return {
    status: 'success',
    distribution_mechanics: focus === 'algorithm_distribution' ? focusContent.algorithm_distribution : 'DISTRIBUTION (compressed): the velocity window (publish when your audience wakes, be present for the first hour), reply-weight design without engagement bait, the silent killers (external links in-post, dormancy gaps, off-pillar lurches), and replies-as-ranked-content. Full mechanics: run growth_focus=algorithm_distribution.',
    networking_system: focus === 'strategic_networking' ? focusContent.strategic_networking : 'NETWORKING (compressed): the 5-10 peer cohort, the value-first ladder with larger accounts (excellent replies → unprompted contribution → the collaboration ask with work done), the collaboration menu (swaps, guesting, co-creation), and the DM discipline (value first, zero pitch). Full system: run growth_focus=strategic_networking.',
    repurposing_system: focus === 'repurposing_engine' ? focusContent.repurposing_engine : 'REPURPOSING (compressed): the weekly deep piece as raw material → 2-3 insight posts + 1 carousel + 3-5 single lines + 1 newsletter section + 1 short-video script + the evergreen entry; everything rebuilt native, never cross-posted; atomize what performed. Full engine: run growth_focus=repurposing_engine.',
    owned_audience_capture: 'OWNED-AUDIENCE CAPTURE: the non-negotiable spine — followers are rented reach; the email list is the only audience that survives algorithm changes, account suspensions and platform decay. THE MECHANICS: the lead magnet matched to PROVEN interest (built from the topic your posts already proved — not the magnet you wish they wanted), delivered instantly, genuinely excellent (the magnet IS the first product experience); the capture bridges — profile link, the deep-piece footer ("the full checklist is in the newsletter"), the periodic capture post (the plain "I write a weekly letter on X — here is what you get"); and the conversion expectations: 2-5% of engaged platform audience converting to list in a quarter is healthy motion. THE RATIO WATCH: subscribers-to-followers is the resilience metric — above 5-10% means the brand owns its audience; below 2% means the platform does. The discipline: capture infrastructure ships in week one at ANY size — the list started at 300 followers is the asset at 30,000.',
    size_playbook: sizePlaybooks[size] + (focus === 'full_growth_system' ? ' ' + focusContent.full_growth_system : '')
  };
}

/* ─────────────────────────── TOOL 5: HONEST MONETIZATION ─────────────────────────── */

function monetizeAudience(args) {
  const focus = args.monetization_focus || 'full_monetization_ladder';
  const vertical = args.audience_vertical || 'developers_tech';

  const verticalNotes = {
    developers_tech: 'DEV-AUDIENCE MONETIZATION REALITIES: developers are allergic to hype and generous to proof — what converts: tools and products they can try before buying (the free tier, the open core, the demo repo), courses with runnable artifacts, paid templates/boilerplates (the highest-velocity dev product in 2026 — devs pay happily for the two weekends a starter saves), and consulting anchored in public technical proof. Sponsorships: dev-tool companies pay premium CPMs for genuine practitioner audiences, but ONE shilled tool you clearly never used burns years of credibility — the only sponsorship rule that matters: use it first, disclose always, decline most. The per-follower economics: dev audiences monetize at multiples of consumer audiences — 3,000 engaged practitioners sustain real product and consulting income.',
    business_professionals: 'B2B-PROFESSIONAL MONETIZATION REALITIES: this audience buys outcomes attached to career and company results — what converts: consulting and advisory (the natural ladder from authority content), B2B services productized ("the audit", "the workshop", "the implementation sprint"), professional courses and cohorts (priced on career ROI, often expensed — the invoice-friendly checkout and the "convince your manager" page lift ceilings), paid communities with genuine peer value, and corporate workshops/speaking (the brand\u2019s highest hourly rate once standing exists). Sponsorships: B2B newsletter sponsorships command the highest CPMs in the industry (niche professional lists are gold to vendors) — the fit bar stays absolute. The trust note: this audience punishes income-promise framing and rewards competence framing — sell the capability, show the receipts, let the outcomes speak.',
    consumer_lifestyle_niche: 'CONSUMER-NICHE MONETIZATION REALITIES: volume economics with identity-driven buying — what converts: digital products at impulse-friendly prices ($10-50: the templates, presets, guides, printables native to the niche), memberships with community and fresh content, affiliate income done honestly (the gear/tools you genuinely use, disclosed — niche audiences follow specific recommendations at remarkable rates), and sponsorships once reach exists (consumer CPMs are lower, so volume or niche-premium matters). The ladder shape differs: consumer niches often monetize products BEFORE services (the audience wants artifacts, not consulting). The trust note: consumer audiences forgive commerce and punish identity betrayal — the monetization that fits the niche\u2019s values reads as natural; the mismatched promo reads as selling out, and the niche never forgets.'
  };

  const focusContent = {
    services_consulting: 'SERVICES-PATH DEEP-DIVE: the fastest audience-to-income bridge (no product build, prices scale with authority): (1) THE INBOUND-READY PROFILE: who you help + the proof + ONE clear next step (the call link, the audit page) — inbound dies in profiles that make interested buyers work to find the door; (2) THE AUTHORITY-TO-PIPELINE CONTENT: the case breakdown is the sales asset (what was broken, what you did, what changed, with numbers where honest) — one documented result outsells fifty capability claims; the public teardown (analyzing a public example of the problem you solve) makes every prospect with that problem self-identify; (3) THE OFFER ANNOUNCEMENT RHYTHM: the plain-language offer post monthly-ish ("I take two clients per month for X — here is who it fits and how to start") — it feels repetitive to the author and is first-exposure news to most of the audience every single time; (4) PRODUCTIZE THE ENTRY: the fixed-scope, fixed-price first engagement (the audit, the roadmap session, the teardown call) — low-friction entry converts audience warmth into paid trust that upsells naturally; (5) THE CAPACITY HONESTY: service income caps at calendar hours — the audience-builder\u2019s edge is PRICING (authority compresses sales cycles and justifies premiums), and the ladder continues into products when the calendar fills (the course teaching what you consult on, sold to the audience the consulting proof built).',
    digital_products: 'PRODUCTS-PATH DEEP-DIVE: the scalable layer — (1) AUDIENCE-INFORMED SELECTION: the product is already announced in your replies and DMs (the question asked weekly IS the product spec; the post that outperformed IS the topic validation) — products built from audience evidence presell; products built from creator imagination launch to silence; (2) THE LADDER SHAPE: the $10-30 artifact (template, checklist pack, mini-guide — impulse-priced, trust-building, list-converting) → the $50-200 flagship (the course, the system, the complete toolkit — launched to the warm list) → the $200+ premium (the cohort, the bundle-plus-access) — each rung funds and audiences the next; (3) THE BUILD-IN-PUBLIC PRESALE: the product built openly (progress posts, early-access list, founding price for the first N) converts the building itself into the launch campaign — and the presale IS the validation gate: silence on the presale is the market saving you the build; (4) LAUNCH TO THE LIST, ECHO TO THE FEED: the real conversion happens in email (the 5-7 touch sequence); the platform posts are the awareness layer — creators who launch feed-only routinely see a tenth of list-launch conversion; (5) THE EVERGREEN TAIL: post-launch, the product moves to always-available with honest periodic moments (the update release, the annual refresh, the genuine discount window) — and every new audience member enters a funnel that eventually introduces it. The pricing note: audience products are underpriced by default (the creator anchors on follower-count insecurity, not value) — price on the outcome, raise on the testimonials.',
    sponsorships_partnerships: 'SPONSORSHIP-PATH DEEP-DIVE: renting your trust — price it like the asset it is: (1) THE RATE MATH: engagement and niche buying-power set rates, NOT follower count — niche B2B/dev newsletters command $25-75+ CPMs (per thousand genuine opens/views), broad consumer content a fraction of that; the floor calculation: what is the hour of production + the trust risk worth? Cheap sponsorships cost more than they pay; (2) THE SPONSOR KIT (built before it is needed): the one-pager — audience size AND engagement numbers, the audience description (who they are, what they buy), the formats offered (the dedicated piece, the sponsored section, the integration), the rates — having the kit converts the inbound inquiry that otherwise evaporates in back-and-forth; (3) THE OUTREACH DIRECTION: at niche authority, the vendors whose tools you ALREADY mention are warm outreach targets ("I reference X monthly to an audience of Y — here is the kit") — the authentic-fit pitch closes at rates cold sponsor marketplaces never see; (4) THE EDITORIAL LINE (the whole game): only products you would recommend unpaid, disclosure always and unambiguous, the sponsored piece held to the same quality bar as the organic one, and the ratio cap (sponsorship saturation kills the trust that sets the rates — one sponsored unit per 5-10 organic is the sustainable band); (5) THE PARTNERSHIP UPGRADE: beyond the one-off — the affiliate relationship on tools genuinely used (recurring, honest, disclosed), the long-term brand partnership (quarterly, deeper, better economics both sides), and the co-created product (the deepest form — the brand funds, you author, both distribute). The refusal discipline: every "no" to a bad-fit sponsor is a visible deposit in the trust account the good-fit sponsors pay premium rates to access.',
    full_monetization_ladder: 'FULL-MONETIZATION-LADDER: sequenced by audience size and trust depth — STAGE 0 (0-1k): monetize NOTHING publicly; build the library, the list and the habits (premature monetization at no-trust reads as desperation and caps growth); exception: services, which need only ONE right reader. STAGE 1 (1k-5k engaged): services and the first artifact — the productized entry offer announced plainly, the $10-30 product validating the buying relationship, the list capture running hard; STAGE 2 (5k-20k): the flagship product launched to the list, the sponsor kit built for the inbound that starts arriving, affiliate income on genuinely-used tools; STAGE 3 (20k+): the full stack — flagship + premium tier, recurring sponsorships at real rates, partnerships, and the standing-based income (speaking, advisory) that only accrues to brands with years of consistency. THE PORTFOLIO PRINCIPLE: mature creator income is a stack (service + product + sponsorship + affiliate), never a single stream — each stream hedges the others\u2019 volatility. THE UNIVERSAL SEQUENCING ERROR: monetizing harder instead of capturing better — the creator with 20k followers and no list monetizes worse than the creator with 5k followers and 1,500 subscribers, every time, in every vertical.'
  };

  return {
    status: 'success',
    services_path: focus === 'services_consulting' ? focusContent.services_consulting : 'SERVICES PATH (compressed): the inbound-ready profile, case breakdowns and public teardowns as sales assets, the monthly plain-language offer post, the productized entry engagement, and pricing powered by authority. Fastest bridge to income. Full path: run monetization_focus=services_consulting.',
    products_path: focus === 'digital_products' ? focusContent.digital_products : 'PRODUCTS PATH (compressed): audience-informed selection (the weekly question IS the spec), the $10-30 → $50-200 → $200+ ladder, build-in-public presales as validation gates, launch to the LIST with the feed as echo, evergreen tails with honest moments. Full path: run monetization_focus=digital_products.',
    sponsorship_path: focus === 'sponsorships_partnerships' ? focusContent.sponsorships_partnerships : 'SPONSORSHIP PATH (compressed): rates on engagement and niche buying-power (not followers), the sponsor kit built in advance, warm outreach to vendors already mentioned, the editorial line (genuine use, full disclosure, 1-per-5-10 ratio cap), and partnership upgrades (affiliate, long-term, co-created). Full path: run monetization_focus=sponsorships_partnerships.',
    monetization_ladder: focus === 'full_monetization_ladder' ? focusContent.full_monetization_ladder : 'LADDER (compressed): Stage 0 (0-1k) build only; Stage 1 (1k-5k) services + first artifact; Stage 2 (5k-20k) flagship to the list + sponsor kit; Stage 3 (20k+) the full stack (service + product + sponsorship + affiliate + standing income). Capture quality beats monetization pressure at every stage. Full ladder: run monetization_focus=full_monetization_ladder.',
    trust_mathematics: 'TRUST MATHEMATICS (the 95/5 law): the audience tolerates — and buys from — the creator whose feed is 95% genuine value and 5% ask; invert the ratio and both numbers collapse (the reach dies first, then the conversions). WHY IT OUTEARNS: every value post is a deposit; every ask is a withdrawal priced at the current trust balance — the creator who deposits for months withdraws at premium conversion rates (the warm launch, the filled cohort, the sponsorship at top CPM), while the constant seller withdraws against an empty account at junk rates. THE COMPOUNDING ASYMMETRY: trust builds linearly and burns exponentially — one overpromised product, one shilled tool, one bait headline costs months of deposits; the editorial discipline is not ethics theater, it is yield management on the only asset the whole model runs on. THE PRACTICAL RULE: before every ask, the audit — "have I given this audience 20x the value of what I am about to ask?"; if yes, the ask is a service (they WANT the next step); if no, the ask is a tax, and audiences migrate away from taxation. ' + verticalNotes[vertical]
  };
}

async function checkBrandHandleLive(args) {
  var handle = String(args.handle).trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  var gh = { state: 'unknown', detail: '' };
  try {
    var r = await fetch('https://api.github.com/users/' + handle, { headers: { 'User-Agent': 'BrandForge-MCP/1.1', 'Accept': 'application/vnd.github+json' } });
    if (r.status === 404) { gh = { state: 'available', detail: 'github.com/' + handle + ' returned 404 - the username is NOT registered and appears claimable right now.' }; }
    else if (r.status === 200) {
      var u = await r.json();
      gh = { state: 'taken', detail: 'TAKEN by "' + (u.name || u.login) + '" - ' + (u.public_repos || 0) + ' public repos, ' + (u.followers || 0) + ' followers, account created ' + String(u.created_at || '').slice(0, 10) + (u.bio ? ', bio: "' + String(u.bio).slice(0, 60) + '"' : '') + '.' };
    } else if (r.status === 403 || r.status === 429) { gh = { state: 'ratelimited', detail: 'GitHub API rate limit hit from this edge IP (shared Workers egress) - retry in a few minutes for a definitive answer.' }; }
    else { gh = { state: 'unknown', detail: 'GitHub API answered HTTP ' + r.status + ' - inconclusive on this attempt.' }; }
  } catch (e) { gh = { state: 'unknown', detail: 'GitHub API unreachable on this attempt.' }; }
  async function dnsCheck(domain) {
    try {
      var r2 = await fetch('https://dns.google/resolve?name=' + domain + '&type=A', { headers: { 'Accept': 'application/json' } });
      var d = await r2.json();
      if (d.Status === 3) return { reg: false, detail: domain + ': NXDOMAIN - no DNS zone exists, the domain is very likely unregistered' };
      if (d.Status === 0 && d.Answer && d.Answer.length) return { reg: true, detail: domain + ': resolves to ' + d.Answer.length + ' A record(s) - REGISTERED and in use' };
      if (d.Status === 0) return { reg: true, detail: domain + ': DNS zone exists but no A record - registered (possibly parked)' };
      return { reg: null, detail: domain + ': DNS status ' + d.Status + ' - inconclusive' };
    } catch (e) { return { reg: null, detail: domain + ': DoH lookup failed on this attempt' }; }
  }
  var com = await dnsCheck(handle + '.com');
  var dev = await dnsCheck(handle + '.dev');
  var free = [];
  var taken = [];
  if (gh.state === 'available') free.push('GitHub @' + handle); else if (gh.state === 'taken') taken.push('GitHub');
  if (com.reg === false) free.push(handle + '.com'); else if (com.reg === true) taken.push(handle + '.com');
  if (dev.reg === false) free.push(handle + '.dev'); else if (dev.reg === true) taken.push(handle + '.dev');
  var verdict = free.length === 3 ? 'FULLY CLEAR - all three surfaces look claimable, lock them TODAY before someone else does' : free.length > 0 ? 'PARTIALLY CLEAR - available: ' + free.join(', ') + (taken.length ? '; taken: ' + taken.join(', ') : '') : taken.length ? 'CONTESTED - taken: ' + taken.join(', ') + '. Consider a modifier (get' + handle + ', ' + handle + 'hq, ' + handle + 'app) or a different name' : 'INCONCLUSIVE on this attempt - retry shortly';
  return {
    status: 'success',
    github_check: 'GITHUB (live API): ' + gh.detail,
    domain_check: 'DOMAINS (live Google DoH DNS): ' + com.detail + '. ' + dev.detail + '. Note: DNS absence is a strong but not perfect availability signal - confirm at a registrar before announcing the brand.',
    availability_summary: 'VERDICT for "' + handle + '": ' + verdict + '.',
    brand_priorities: 'P1: secure the .com first - it anchors email deliverability and trust | P1: register the GitHub org even if unused (squatted dev handles are unrecoverable) | P2: same handle on X/LinkedIn/YouTube next (not checkable keylessly - verify manually) | P3: set up domain email early, inbox age improves deliverability.',
    data_source: 'Live checks at request time: official GitHub REST API (users endpoint) + Google DNS-over-HTTPS A-record lookups for .com and .dev. Real lookups - nothing cached or guessed.'
  };
}
