import React, { useState, useEffect, useRef } from 'react';
import { SignUpButton } from "@clerk/clerk-react";
import { Icons } from './icons';
import { COSTUMES } from '../constants';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Sparkles, Zap, Shield, Star, Users, Award, Play, ChevronRight, Check } from 'lucide-react';

// Optimized particle effect component with performance improvements
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];
    
    // Create particles with reduced count on mobile
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (currentTime - lastTime < 16) { // ~60fps
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > rect.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(particle.x, rect.width));
        }
        if (particle.y < 0 || particle.y > rect.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(particle.y, rect.height));
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${particle.opacity})`;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
};

// Animated counter component
const AnimatedCounter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isInView, end]);
  
  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Feature card with glassmorphism
const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number;
  gradient?: string;
}> = ({ icon, title, description, delay = 0, gradient = 'from-purple-500/20 to-pink-500/20' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-6">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// Before/After slider with enhanced animations
const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const originalImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop";
  const transformedImage = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop";

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-3xl overflow-hidden select-none cursor-ew-resize shadow-2xl"
      onMouseMove={(e) => isDragging && handleMove(e.clientX)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={(e) => isDragging && handleMove(e.touches[0].clientX)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <img src={originalImage} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden" 
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={transformedImage} alt="Transformed" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </div>
      </div>
      
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        After
      </div>
    </motion.div>
  );
};

// Testimonial card
const TestimonialCard: React.FC<{ 
  name: string; 
  role: string; 
  content: string; 
  avatar: string;
  rating: number;
}> = ({ name, role, content, avatar, rating }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
    >
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
        ))}
      </div>
      <p className="text-gray-300 mb-6 leading-relaxed">"{content}"</p>
      <div className="flex items-center">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="text-white font-semibold">{name}</p>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Pricing card
const PricingCard: React.FC<{
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}> = ({ name, price, description, features, popular, cta }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`relative ${popular ? 'scale-105' : ''}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}
      <div className={`bg-white/5 backdrop-blur-xl border ${popular ? 'border-purple-500/50' : 'border-white/10'} rounded-2xl p-8`}>
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-white">{price}</span>
          {price !== 'Free' && <span className="text-gray-400">/month</span>}
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <Check className="w-5 h-5 text-green-400 mr-3" />
              {feature}
            </li>
          ))}
        </ul>
        <SignUpButton>
          <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
            popular 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}>
            {cta}
          </button>
        </SignUpButton>
      </div>
    </motion.div>
  );
};

export const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  
  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const heroY = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, -150]), springConfig);

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleField />
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
        
        {/* Animated background elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.h1
              style={{ y: heroY }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                Transform Into
              </span>
              <br />
              <span className="text-white">Any Character</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                With AI Magic
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              From selfie to superhero in 2.5 seconds. Join 250,000+ creators who've discovered the future of cosplay with our revolutionary AI technology.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <SignUpButton>
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10">Start Free Transformation</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </button>
              </SignUpButton>
              
              <button className="px-8 py-4 border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>
            
            {/* Hero images */}
            <motion.div
              style={{ opacity }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
                >
                  <img
                    src={`https://picsum.photos/seed/${i}/300/400`}
                    alt={`Transformation ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <AnimatedCounter end={250} suffix="K+" />
              </div>
              <p className="text-gray-400 mt-2">Happy Creators</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                4.9/5
              </div>
              <p className="text-gray-400 mt-2">Average Rating</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <AnimatedCounter end={2.5} suffix="s" />
              </div>
              <p className="text-gray-400 mt-2">Average Transform Time</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <p className="text-gray-400 mt-2">Costume Options</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black mb-8"
            >
              Cosplay Used to Take{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Months & Cost Thousands
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-2xl text-gray-300 mb-16"
            >
              Now transform in seconds with AI magic that costs less than a coffee
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-white mb-6">Traditional Cosplay</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-4" />
                  <span>3-6 months of planning & crafting</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-4" />
                  <span>$500-$5,000+ in materials</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-4" />
                  <span>Professional photography sessions</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-4" />
                  <span>Limited to one character at a time</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-white mb-6">AI Cosplay Magic</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4" />
                  <span>2.5 seconds from selfie to cosplay</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4" />
                  <span>Starting at $9.99/month</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4" />
                  <span>500+ characters instantly available</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-4" />
                  <span>4K resolution, ready to share</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              The Future of{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Fandom is Here
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Our state-of-the-art AI provides unmatched quality and speed, making professional-grade cosplay accessible to everyone.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <FeatureCard
                icon={<Sparkles className="w-8 h-8 text-white" />}
                title="Hyper-Realistic Results"
                description="Our AI preserves your unique facial features, ensuring the transformation looks like you, not just a generic model."
                delay={0}
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-white" />}
                title="Lightning Fast"
                description="Transform in 2.5 seconds with our optimized AI pipeline. No waiting, just instant cosplay magic."
                delay={0.1}
              />
            </div>
            
            <div className="lg:col-span-1">
              <BeforeAfterSlider />
            </div>
            
            <div className="space-y-8">
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-white" />}
                title="Privacy First"
                description="Your photos are processed securely and never stored. Full control over your data with enterprise-grade security."
                delay={0.2}
              />
              <FeatureCard
                icon={<Award className="w-8 h-8 text-white" />}
                title="4K Quality"
                description="Get high-resolution, watermark-free images perfect for printing, social media, or professional portfolios."
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Perfect for Every{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Creator
              </span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Cosplayers',
                description: 'Perfect your convention look with instant transformations',
                icon: <Users className="w-8 h-8" />,
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Content Creators',
                description: 'Level up your social media with stunning character transformations',
                icon: <Zap className="w-8 h-8" />,
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Gamers',
                description: 'Become your main character and share with your community',
                icon: <Sparkles className="w-8 h-8" />,
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Businesses',
                description: 'Create engaging marketing content with character transformations',
                icon: <Award className="w-8 h-8" />,
                gradient: 'from-orange-500 to-red-500'
              }
            ].map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${useCase.gradient} rounded-xl flex items-center justify-center mb-4 text-white`}>
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                  <p className="text-gray-300">{useCase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Loved by{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                250,000+ Creators
              </span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              name="Sarah Chen"
              role="Cosplay Artist"
              content="This AI is absolutely incredible! I went from skeptic to superfan in 2.5 seconds. The quality is mind-blowing and it's saved me hundreds of hours."
              avatar="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop"
              rating={5}
            />
            <TestimonialCard
              name="Marcus Rodriguez"
              role="Content Creator"
              content="My engagement went through the roof after using this. My followers can't believe it's AI - they think I hired a professional photographer!"
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              rating={5}
            />
            <TestimonialCard
              name="Emma Thompson"
              role="Gaming Streamer"
              content="Perfect for creating thumbnails and social content. The variety of characters is insane and the quality is consistently amazing. Worth every penny!"
              avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Start Creating{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Magic Today
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Choose the perfect plan for your creative journey. Cancel anytime.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="Free"
              description="Perfect for trying out the magic"
              features={[
                '5 transformations per month',
                '720p resolution',
                'Basic costume library',
                'Watermark included'
              ]}
              cta="Start Free"
            />
            <PricingCard
              name="Pro"
              price="$9.99"
              description="For serious creators"
              features={[
                'Unlimited transformations',
                '4K resolution downloads',
                'Full costume library',
                'No watermarks',
                'Priority processing',
                'Commercial license'
              ]}
              popular
              cta="Start Pro Trial"
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For businesses and teams"
              features={[
                'Everything in Pro',
                'Custom costume creation',
                'API access',
                'Team collaboration',
                'White-label options',
                'Dedicated support'
              ]}
              cta="Contact Sales"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-400">
              30-day money-back guarantee • Cancel anytime • No hidden fees
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transform Your World?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join 250,000+ creators who've discovered the future of cosplay. Start free, upgrade anytime.
            </p>
            <SignUpButton>
              <button className="group relative px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10">Start Your Free Transformation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Cosplay Transformer AI. Making magic happen, one transformation at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
