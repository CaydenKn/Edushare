'use client';

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import AuthForm from '@/components/ui/LoginForm';
import AuthDialog from '@/components/ui/AuthDialog';
import FeatureHighlights from '@/components/ui/FeatureHighlights';
import { Laptop, Upload, Search, Users, BookOpen, Rocket } from "lucide-react";
import cn from 'classnames';

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  const openLogin = () => setIsLoginOpen(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="p-5 bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 mr-8">EduShare</Link>
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-black")}>
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-black")}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main>
        <HeroSection openLogin={openLogin} setIsLoginOpen={setIsLoginOpen} />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection openLogin={openLogin} />
      </main>

      <AuthDialog isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} isSignup={true} />

      <footer className="bg-gray-100 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-black">
          <p className="mb-4">&copy; 2024 EduShare. All rights reserved.</p>
          <nav className="flex justify-center space-x-4">
            <Link href="/about" className="text-blue-600 hover:underline">About</Link>
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

const HeroSection = ({ openLogin, setIsLoginOpen }) => (
  <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Share Knowledge, Grow Together</h1>
        <p className="text-xl mb-8">Upload and discover study materials from students at your campus.</p>
        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-100" onClick={openLogin}>
          Get Started
        </Button>
      </div>
      <div className="md:w-1/2">
        <AuthForm />
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-12 text-black">Why Choose EduShare?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center mb-12 text-black">What Our Users Say</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestimonialCard
          quote="EduShare has completely transformed how I study. The ability to access notes from top students in my class is invaluable."
          author="Sarah J., Computer Science Major"
        />
        <TestimonialCard
          quote="As a teaching assistant, I love how EduShare makes it easy to share supplementary materials with my students."
          author="Mark T., Physics Graduate Student"
        />
        <TestimonialCard
          quote="The collaborative features on EduShare have helped me form lasting study groups and friendships on campus."
          author="Emily R., Business Administration"
        />
      </div>
    </div>
  </section>
);

const CTASection = ({ openLogin }) => (
  <section className="bg-blue-600 text-white py-20">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-semibold mb-6">Ready to Elevate Your Learning Experience?</h2>
      <p className="text-xl mb-8">Join thousands of students already using EduShare to excel in their studies.</p>
      <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-100" onClick={openLogin}>
        Sign Up Now
      </Button>
    </div>
  </section>
);

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "flex select-none space-x-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {icon}
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-center mb-4 text-blue-600">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; author: string }> = ({ quote, author }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <p className="text-gray-800 font-semibold">- {author}</p>
  </div>
);

const features = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Easy Uploads",
    description: "Quickly share your notes, presentations, and study guides with your peers.",
    href: "/features/upload",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Smart Discovery",
    description: "Find relevant study materials based on your courses and interests.",
    href: "/features/discovery",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaborative Learning",
    description: "Connect with classmates, form study groups, and learn together.",
    href: "/features/collaborate",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Diverse Content",
    description: "Access a wide range of study materials, from lecture notes to practice exams.",
    href: "/features/content",
  },
  {
    icon: <Laptop className="w-6 h-6" />,
    title: "Cross-Platform",
    description: "Use EduShare on any device, anytime, anywhere.",
    href: "/features/platforms",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Personalized Learning",
    description: "Get recommendations tailored to your learning style and goals.",
    href: "/features/personalization",
  },
];  