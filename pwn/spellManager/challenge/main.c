#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <stdint.h>

#define MAX_SPELLS 32
#define NAME_LEN 32
#define EFFECT_LEN 64
#define MAX_FEEDBACKS 2

typedef enum {
    FIRE = 0,
    ICE,
    ARCANE,
    DARK,
    LIGHTNING
} Element;

const char* get_element_name(Element e) {
    switch (e) {
        case FIRE: return "Fire";
        case ICE: return "Ice";
        case ARCANE: return "Arcane";
        case DARK: return "Dark";
        case LIGHTNING: return "Lightning";
        default: return "Unknown";
    }
}

typedef struct {
    char name[NAME_LEN];
    char effect[EFFECT_LEN];
    uint32_t mana_cost;
    uint32_t cooldown;
    Element element;
} Spell;

Spell* grimoire[MAX_SPELLS] = {NULL};
char * feedbacks[MAX_FEEDBACKS] = {NULL};

void add_spell() {
    int index;
    uint16_t r = 0;
    printf("Choose spell slot (0-%d): ", MAX_SPELLS - 1);
    scanf("%d", &index);
    while (getchar() != '\n');

    if (index < 0 || index >= MAX_SPELLS) {
        puts("Invalid slot.\n");
        return;
    }

    grimoire[index] = (Spell*)calloc(1, sizeof(Spell));
    if (!grimoire[index]) {
        puts("Memory allocation failed.");
        exit(1);
    }

    printf("Enter spell name: ");
    r = read(0, grimoire[index]->name, NAME_LEN);
    if (r == -1) {
        perror("read");
        free(grimoire[index]);
        grimoire[index] = NULL;
        return;
    }
    grimoire[index]->name[r] = '\0';

    printf("Enter spell effect: ");
    r = read(0, grimoire[index]->effect, EFFECT_LEN);
    if (r == -1) {
        perror("read");
        free(grimoire[index]);
        grimoire[index] = NULL;
        return;
    }
    grimoire[index]->effect[r] = '\0';

    printf("Enter mana cost: ");
    scanf("%u", &grimoire[index]->mana_cost);

    printf("Enter cooldown (in seconds): ");
    scanf("%u", &grimoire[index]->cooldown);

    printf("Enter element:\n");
    printf("  0 = Fire\n  1 = Ice\n  2 = Arcane\n  3 = Dark\n  4 = Lightning\n");
    printf("Choice: ");
    uint32_t elem;
    scanf("%u", &elem);
    grimoire[index]->element = (Element)elem;

    while (getchar() != '\n');
    puts("Spell added!\n");
}


void edit_spell() {
    int index;
    uint16_t r = 0;

    printf("Enter spell slot to edit (0-%d): ", MAX_SPELLS - 1);
    scanf("%d", &index);
    while (getchar() != '\n');

    if (index < 0 || index >= MAX_SPELLS || grimoire[index] == NULL) {
        puts("Invalid slot.");
        return;
    }

    printf("Editing spell at slot %d...\n", index);

    printf("Enter new spell name: ");
    r = read(0, grimoire[index]->name, NAME_LEN);
    if (r == -1) {
        perror("read");
        return;
    }
    grimoire[index]->name[r] = '\0';

    printf("Enter new effect: ");
    r = read(0, grimoire[index]->effect, EFFECT_LEN);
    if (r == -1) {
        perror("read");
        return;
    }

    printf("Enter new mana cost: ");
    scanf("%u", &grimoire[index]->mana_cost);

    printf("Enter new cooldown (in seconds): ");
    scanf("%u", &grimoire[index]->cooldown);

    printf("Enter new element:\n");
    printf("  0 = Fire\n  1 = Ice\n  2 = Arcane\n  3 = Dark\n  4 = Lightning\n");
    printf("Choice: ");
    uint32_t elem;
    scanf("%u", &elem);
    grimoire[index]->element = (Element)elem;

    while (getchar() != '\n');
    puts("Spell updated!\n");
}

void view_spells() {
    for (int i = 0; i < MAX_SPELLS; i++) {
        if (grimoire[i]) {
            printf("Slot %d:\n", i);
            printf("  Name: %s\n", grimoire[i]->name);
            printf("  Effect: %s\n", grimoire[i]->effect);
            printf("  Mana Cost: %d\n", grimoire[i]->mana_cost);
            printf("  Cooldown: %d\n", grimoire[i]->cooldown);
            printf("  Element: %s\n", get_element_name(grimoire[i]->element));
        }
    }
    puts("");
}

void delete_spell() {
    int index;
    printf("Enter spell slot to delete (0-%d): ", MAX_SPELLS - 1);
    scanf("%d", &index);
    while (getchar() != '\n');

    if (index < 0 || index >= MAX_SPELLS || grimoire[index] == NULL) {
        puts("Invalid slot.");
        return;
    }

    free(grimoire[index]);
    puts("Spell deleted!\n");
}

void feedback() {
    unsigned int size;
    printf("Enter size of feedback: ");
    scanf("%u", &size);
    while (getchar() != '\n');
    if (size > 0x100) {
        puts("Size too large.");
        return;
    }
    for (int i = 0; i < MAX_FEEDBACKS; i++) {
        if (feedbacks[i] == NULL) {
            feedbacks[i] = (char*)malloc(size);
            if (!feedbacks[i]) {
                puts("Memory allocation failed.");
                return;
            }
            printf("Enter feedback: ");
            int r = read(0, feedbacks[i], size);
            if (r == -1) {
                perror("read");
                free(feedbacks[i]);
                feedbacks[i] = NULL;
                return;
            }
            puts(feedbacks[i]);
            return;
        }
    }
}




void setup() {
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);
}

void menu() {
    while (1) {
        puts("=== Grimoire Menu ===");
        puts("1. Add Spell");
        puts("2. Edit Spell");
        puts("3. View Spells");
        puts("4. Delete Spell");
        puts("5. Feedback");
        puts("6. Exit");
        printf("Choice: ");

        int choice;
        scanf("%u", &choice);
        while (getchar() != '\n');

        switch (choice) {
            case 1: add_spell(); break;
            case 2: edit_spell(); break;
            case 3: view_spells(); break;
            case 4: delete_spell(); break;
            case 5: feedback(); break;
            case 6: puts("Exiting..."); return;
            default: puts("Invalid choice.\n"); break;
        }
    }
}

int main() {
    uint64_t return_code __attribute__((aligned(16)));
    return_code = 0x81;
    setup();
    menu();
    return return_code;
}
