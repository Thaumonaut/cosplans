<script lang="ts">
	import type { ComponentType } from 'svelte';

	import {
		Archive,
		CalendarDays,
		Check,
		ChevronDown,
		ChevronLeft,
		ChevronRight,
		ChevronUp,
		Home,
		Image,
		LayoutDashboard,
		ListTodo,
		LogOut,
		MapPin,
		MessageCircle,
		Monitor,
		Moon,
		Package,
		Palette,
		PiggyBank,
		Shirt,
		ShieldCheck,
		SlidersHorizontal,
		Sparkles,
		Sun,
		SunMoon,
		User,
		UserCog,
		Users,
		UsersRound,
		Wrench
	} from 'lucide-svelte';

	import type { LucideIconName } from '$lib/types/navigation';

	const ICONS: Record<LucideIconName, ComponentType> = {
		Archive,
		CalendarDays,
		Check,
		ChevronDown,
		ChevronLeft,
		ChevronRight,
		ChevronUp,
		Home,
		Image,
		LayoutDashboard,
		ListTodo,
		LogOut,
		MapPin,
		MessageCircle,
		Monitor,
		Moon,
		Package,
		Palette,
		PiggyBank,
		Shirt,
		ShieldCheck,
		SlidersHorizontal,
		Sparkles,
		Sun,
		SunMoon,
		User,
		UserCog,
		Users,
		UsersRound,
		Wrench
	};

	export let name: LucideIconName;
	export let size = 20;
	export let className = '';
	export let strokeWidth = 2;
	export let ariaHidden = true;

	const IconComponent = ICONS[name] ?? LayoutDashboard;
</script>

<svelte:component
	this={IconComponent}
	class={className}
	data-icon={name}
	{size}
	stroke-width={strokeWidth}
	aria-hidden={ariaHidden}
/>
