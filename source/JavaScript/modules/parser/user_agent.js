export function parse_user_agent(user_agent_string) {
	if (!user_agent_string) return null;

	// First check if it's a bot
	const bot_result = parse_bot_user_agent(user_agent_string);
	if (bot_result) return { ...bot_result, type: "bot" };

	// Not a bot, parse as human user agent
	const human_result = parse_human_user_agent(user_agent_string);
	return { ...human_result, type: "human" };

	function parse_bot_user_agent(user_agent_string) {
		// Format: [regex, bot_name, bot_owner (if known)]
		const bot_patterns = [
		  [/AhrefsBot\/(\d+(\.\d+)?)/, "AhrefsBot", "Ahrefs"],
		  [/Googlebot\/(\d+(\.\d+)?)/, "Googlebot", "Google"],
		  [/bingbot\/(\d+(\.\d+)?)/, "Bingbot", "Microsoft"],
		  [/YandexBot\/(\d+(\.\d+)?)/, "YandexBot", "Yandex"],
		  [/Baiduspider\/(\d+(\.\d+)?)/, "Baiduspider", "Baidu"],
		  [/DuckDuckBot\/(\d+(\.\d+)?)/, "DuckDuckBot", "DuckDuckGo"],
		  [/facebookexternalhit\/(\d+(\.\d+)?)/, "Facebook Bot", "Facebook"],
		  [/Twitterbot\/(\d+(\.\d+)?)/, "Twitterbot", "Twitter"],
		  [/LinkedInBot\/(\d+(\.\d+)?)/, "LinkedInBot", "LinkedIn"],
		  [/Pinterestbot\/(\d+(\.\d+)?)/, "Pinterestbot", "Pinterest"],
		  [/Slackbot\/(\d+(\.\d+)?)/, "Slackbot", "Slack"],
		  [/Discordbot\/(\d+(\.\d+)?)/, "Discordbot", "Discord"],
		  [/Applebot\/(\d+(\.\d+)?)/, "Applebot", "Apple"],
		  [/SemrushBot\/(\d+(\.\d+)?)/, "SemrushBot", "Semrush"],
		  [/MJ12bot\/(\d+(\.\d+)?)/, "MJ12bot", "Majestic"],
		  [/Rogerbot\/(\d+(\.\d+)?)/, "Rogerbot", "Moz"],
		  [/PetalBot\/(\d+(\.\d+)?)/, "PetalBot", "Huawei"],
		  [/Uptimebot\/(\d+(\.\d+)?)/, "Uptimebot", "Uptime"],
		  [/Dataprovider.com/, "Dataprovider", "Dataprovider.com"],
		  [/CCBot\/(\d+(\.\d+)?)/, "CCBot", "Common Crawl"],

		  // Generic bot patterns
		  [/[Bb]ot|[Cc]rawler|[Ss]pider|[Ss]craper/, "Unknown Bot", null]
		];

		for (const [pattern, name, owner] of bot_patterns) {
		  const match = user_agent_string.match(pattern);

		  if (match) {
			const result = {
			  bot_name: name,
			  bot_owner: owner,
			  device: "bot"
			};

			// Extract URL if provided in user agent string
			const URL_match = user_agent_string.match(/\+(?:https?:\/\/[^\s\)]+)/);
			if (URL_match) result.bot_info_URL = URL_match[0].substring(1);

			// Extract bot version if available in the match
			if (match[1]) result.bot_version = match[1];

			return result;
		  }
		}

		// No bot detected
		return null;
	}

	function parse_human_user_agent(user_agent_string){
		const result = {};

		const browser_patterns = {
			"Opera": /(OPR|Opera|Opera GX)\/(\d+\.\d+)/,
			"Edge": /(EdgA?|Edge|Edg)\/(\d+\.\d+)/, // Added EdgA pattern
			"SamsungBrowser": /SamsungBrowser\/(\d+\.\d+)/,
			"Chrome": /Chrome\/(\d+\.\d+)/,
			"Firefox": /Firefox\/(\d+\.\d+)/,
			"Safari": /Safari\/(\d+\.\d+)/
		};

		for (const [browser, pattern] of Object.entries(browser_patterns)) {
			const match = user_agent_string.match(pattern);

			if (match) {
				result.browser = browser;
				result.browser_version = ["Opera", "Edge"].includes(browser) ? match[2] : match[1];
				break;
			}
		}

		const OS_patterns = {
			"iOS": {
				pattern: /CPU (?:iPhone |iPad )?OS (\d+_\d+(_\d+)?)/,
				process: (v) => v[1].replace(/_/g, ".")
			},

			"Android": {
				pattern: /Android (\d+(\.\d+)?)/,
				process: (v) => v[1]
			},

			"macOS": {
				pattern: /(Mac OS X|Macintosh) (\d+[._]\d+[._]\d+)/,
				process: (v) => v[2].replace(/_/g, ".")
			},

			"Windows": {
				pattern: /Windows NT (\d+\.\d+)/,
				process: (v) => v[1]
			},

			"Linux": {
				pattern: /Linux|Ubuntu|Debian|CentOS|Fedora|Red Hat|SUSE/,
				process: () => "Unknown"
			}
		};

		for (const [OS_name, { pattern, process }] of Object.entries(OS_patterns)) {
			const match = user_agent_string.match(pattern);

			if (match) {
				result.OS = OS_name;
				result.OS_version = process(match);
				break;
			}
		}

		const engine_patterns = {
			"WebKit": /WebKit\/(\d+\.\d+)/,
			"Gecko": /Gecko\/(\d+\.\d+)/,
			"Blink": /Blink\/(\d+\.\d+)/
		};

		for (const [engine, pattern] of Object.entries(engine_patterns)) {
			const match = user_agent_string.match(pattern);

			if (match) {
				result.engine = `${engine} ${match[1]}`;
				break;
			}
		}

		if (user_agent_string.includes("Mobile")) result.device = "mobile";
		else if (user_agent_string.includes("Tablet")) result.device = "tablet";
		else result.device = "desktop";

		return result;
	}
}
