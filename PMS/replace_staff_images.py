import re

file_path = 'Campus.html'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern for the staff section images
# We just need to replace the srcset and src with something simpler.
# We'll replace the `<figure>...` inside ShortCourseStaffTaught_staffimage__uq_vd
# Using a generic avatar placeholder for the staff profiles
avatar_html = '''<figure><img alt="staff profile" loading="lazy" decoding="async" src="https://ui-avatars.com/api/?name=Staff+Member&background=2f2750&color=fff&size=512" style="position: absolute; height: 100%; width: 100%; inset: 0px; object-fit: cover; color: transparent;"></figure>'''

new_text = re.sub(
    r'(<div class="ShortCourseStaffTaught_staffimage__uq_vd">\s*)<figure.*?</figure>(\s*</div>)',
    r'\g<1>' + avatar_html + r'\g<2>',
    text,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Staff Profile Images replaced successfully.")
