import { personalInfo } from "@/data/resume";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} {personalInfo.name}. Built with React & Three.js
      </p>
    </footer>
  );
}
