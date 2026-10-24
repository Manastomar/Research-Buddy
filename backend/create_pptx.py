import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

def create_diagram():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_slide_layout)

    # Background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = RGBColor(0x18, 0x18, 0x1B)
    bg.line.fill.background()

    # Colors
    BORDER_COLOR = RGBColor(0x71, 0x71, 0x7A)
    BOUND_COLOR = RGBColor(0x3F, 0x3F, 0x46)
    BOX_FILL = RGBColor(0x18, 0x18, 0x1B)
    LABEL_BG = RGBColor(0x27, 0x27, 0x2A)
    TEXT_WHITE = RGBColor(0xFF, 0xFF, 0xFF)
    TEXT_MUTED = RGBColor(0xD4, 0xD4, 0xD8)

    # 1. System Boundary
    boundary = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(2.7), Inches(0.8), Inches(6.4), Inches(6.0))
    boundary.fill.solid()
    boundary.fill.fore_color.rgb = RGBColor(0x18, 0x18, 0x1B)
    boundary.line.color.rgb = BOUND_COLOR
    boundary.line.width = Pt(1.5)

    # Boundary Header Line & Text
    b_text = slide.shapes.add_textbox(Inches(2.8), Inches(0.85), Inches(5.0), Inches(0.4))
    p = b_text.text_frame.paragraphs[0]
    p.text = "Research Buddy System Boundary"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_MUTED

    b_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(2.7), Inches(1.25), Inches(6.4), Inches(0.02))
    b_line.fill.solid()
    b_line.fill.fore_color.rgb = BOUND_COLOR
    b_line.line.fill.background()

    # Helper function to add pill shape with text
    def add_pill(x, y, w, h, text, subtext=None, font_size=11):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
        shape.fill.solid()
        shape.fill.fore_color.rgb = BOX_FILL
        shape.line.color.rgb = BORDER_COLOR
        shape.line.width = Pt(1.5)
        
        tf = shape.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = text
        p.font.size = Pt(font_size)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER
        
        if subtext:
            p2 = tf.add_paragraph()
            p2.text = subtext
            p2.font.size = Pt(font_size - 2)
            p2.font.color.rgb = TEXT_WHITE
            p2.alignment = PP_ALIGN.CENTER
        return shape

    # Helper function for label tags
    def add_tag(x, y, w, h, text):
        tag = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
        tag.fill.solid()
        tag.fill.fore_color.rgb = LABEL_BG
        tag.line.color.rgb = BOUND_COLOR
        tag.line.width = Pt(1)
        tf = tag.text_frame
        p = tf.paragraphs[0]
        p.text = text
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_MUTED
        p.alignment = PP_ALIGN.CENTER
        return tag

    # ================= ACTORS =================
    # Left Actor
    add_pill(0.4, 3.4, 2.0, 0.55, "👤 User / Researcher")

    # Right Actor
    add_pill(10.8, 3.4, 2.1, 0.55, "🤖 Google Gemini AI")

    # ================= USE CASES =================
    add_pill(2.9, 1.45, 1.8, 0.5, "Register / Sign Up")
    add_pill(2.9, 2.25, 2.0, 0.5, "Sign In / Authenticate")
    add_pill(2.9, 3.05, 2.4, 0.75, "Generate Research Paper", "(Abstract, Intro, Analysis)", font_size=11)
    add_pill(2.9, 4.05, 2.6, 0.5, "Check Plagiarism & Originality")
    add_pill(2.9, 4.85, 1.8, 0.5, "Humanize AI Text")
    add_pill(2.9, 5.65, 2.5, 0.5, "Track Real-Time Word Count")

    # UC7: Model Failover
    add_pill(6.7, 3.15, 2.2, 0.55, "Automatic Model Failover")

    # ================= LABELS =================
    add_tag(5.5, 3.25, 0.9, 0.32, "requires")
    add_tag(9.2, 2.75, 1.4, 0.32, "API Request/Response")
    add_tag(9.5, 3.25, 0.9, 0.32, "Fallback API")
    add_tag(9.2, 4.15, 1.4, 0.32, "NLP / Semantic Check")

    # ================= CONNECTING LINES =================
    def add_connector(x1, y1, x2, y2, dashed=False):
        connector = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(min(x1, x2)), Inches(min(y1, y2)), Inches(max(abs(x2-x1), 0.02)), Inches(max(abs(y2-y1), 0.02)))
        connector.fill.solid()
        connector.fill.fore_color.rgb = BORDER_COLOR
        connector.line.fill.background()
        return connector

    # Left Trunk & Branches
    add_connector(2.4, 3.65, 2.65, 3.65) # User to trunk
    add_connector(2.65, 1.7, 2.65, 5.9)  # Vertical trunk
    add_connector(2.65, 1.7, 2.9, 1.7)   # to UC1
    add_connector(2.65, 2.5, 2.9, 2.5)   # to UC2
    add_connector(2.65, 3.42, 2.9, 3.42) # to UC3
    add_connector(2.65, 4.3, 2.9, 4.3)   # to UC4
    add_connector(2.65, 5.1, 2.9, 5.1)   # to UC5
    add_connector(2.65, 5.9, 2.9, 5.9)   # to UC6

    # UC3 to UC7
    add_connector(5.3, 3.42, 6.7, 3.42)

    # Right Connections
    add_connector(8.9, 3.42, 10.8, 3.42) # UC7 to Gemini
    add_connector(5.3, 3.3, 9.2, 2.9)    # UC3 to Gemini
    add_connector(5.5, 4.3, 10.8, 3.65)  # UC4 to Gemini

    # Save outputs
    paths = [
        r"C:\Users\Manas Tomar\OneDrive\Desktop\use_case_diagram.pptx",
        r"C:\Users\Manas Tomar\Downloads\use_case_diagram.pptx",
        r"C:\Users\Manas Tomar\OneDrive\Desktop\Research Buddy Code\ai_content_generator_new\ai-content-generator\use_case_diagram.pptx"
    ]
    for p in paths:
        prs.save(p)
        print(f"Saved: {p}")

if __name__ == "__main__":
    create_diagram()
