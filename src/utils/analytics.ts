// Simple Google Analytics utility for tracking user interactions
class Analytics {
  private currentSession: {
    sessionId: string;
    startTime: number;
    uploads: number;
    downloads: number;
    processed: number;
  };

  constructor() {
    this.currentSession = this.initializeSession();
    // Don't track page view immediately - wait for GA to be initialized
  }

  private initializeSession() {
    return {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      uploads: 0,
      downloads: 0,
      processed: 0
    };
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Track page view
  trackPageView(): void {
    this.sendToGA('page_view', {
      page_title: 'Photo Drawing Helper',
      page_location: window.location.href
    });
  }

  // Track image upload
  trackImageUpload(fileSize: number, fileType: string): void {
    this.currentSession.uploads += 1;

    this.sendToGA('image_upload', {
      file_size: Math.round(fileSize / 1024), // Size in KB
      file_type: fileType,
      session_uploads: this.currentSession.uploads
    });

    console.log(`📊 Analytics: Image uploaded (${fileType}, ${Math.round(fileSize / 1024)}KB)`);
  }

  // Track image processing completion
  trackImageProcessed(processingTime: number): void {
    this.currentSession.processed += 1;

    this.sendToGA('image_processed', {
      processing_time: Math.round(processingTime / 1000), // Time in seconds
      session_processed: this.currentSession.processed
    });

    console.log(`📊 Analytics: Image processed (${Math.round(processingTime / 1000)}s)`);
  }

  // Track individual download
  trackIndividualDownload(imageType: 'highlights' | 'midtones' | 'shadows' | 'darks'): void {
    this.currentSession.downloads += 1;

    this.sendToGA('individual_download', {
      image_type: imageType,
      session_downloads: this.currentSession.downloads
    });

    console.log(`📊 Analytics: Individual download (${imageType})`);
  }

  // Track bulk download
  trackBulkDownload(imageCount: number): void {
    this.currentSession.downloads += imageCount;

    this.sendToGA('bulk_download', {
      image_count: imageCount,
      session_downloads: this.currentSession.downloads
    });

    console.log(`📊 Analytics: Bulk download (${imageCount} images)`);
  }

  // Send events to Google Analytics (if gtag is available)
  private sendToGA(eventName: string, parameters: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', eventName, {
          custom_parameter: true,
          ...parameters
        });
        console.log(`📊 GA Event sent: ${eventName}`, parameters);
      } catch (error) {
        console.error('📊 GA Error sending event:', error);
      }
    } else {
      console.warn('📊 GA not available, event not sent:', eventName, parameters);
    }
  }

  // Initialize Google Analytics
  static initializeGA(measurementId: string): void {
    if (typeof window === 'undefined') return;

    // Add Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    
    script1.onload = () => {
      console.log('📊 Google Analytics script loaded successfully');
    };
    
    script1.onerror = () => {
      console.error('📊 Failed to load Google Analytics script');
    };
    
    document.head.appendChild(script1);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false // We'll handle page views manually
    });

    console.log(`📊 Google Analytics initialized with ID: ${measurementId}`);
    
    // Track initial page view after GA is set up
    setTimeout(() => {
      analytics.trackPageView();
    }, 1000); // Small delay to ensure GA script is loaded
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Export the class for potential custom instances
export { Analytics };